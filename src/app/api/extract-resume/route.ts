import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured in .env.local' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // First, let's fetch the list of available models to ensure we pick one that exists for this API key
    let selectedModel = 'gemini-1.5-flash'; // default fallback
    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (modelsRes.ok) {
        const data = await modelsRes.json();
        const availableModels = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
          
        if (availableModels.length > 0) {
          // Prefer flash, then pro, then whatever is available
          if (availableModels.includes('gemini-1.5-flash')) selectedModel = 'gemini-1.5-flash';
          else if (availableModels.includes('gemini-1.5-pro')) selectedModel = 'gemini-1.5-pro';
          else if (availableModels.includes('gemini-1.0-pro')) selectedModel = 'gemini-1.0-pro';
          else if (availableModels.includes('gemini-pro')) selectedModel = 'gemini-pro';
          else selectedModel = availableModels[0];
        }
      }
    } catch (e) {
      console.warn("Could not list models, falling back to default", e);
    }

    console.log("Using Gemini model:", selectedModel);
    
    // Only use responseMimeType if it's a 1.5 model, as older models don't support it
    const is15Model = selectedModel.includes('1.5');
    const generationConfig = is15Model ? { responseMimeType: "application/json" } : undefined;

    const model = genAI.getGenerativeModel({ 
      model: selectedModel,
      ...(generationConfig && { generationConfig })
    });

    const prompt = `
      You are an expert resume parser. I will provide you with the raw extracted text from a resume PDF.
      CRITICAL INSTRUCTIONS:
      - You MUST return a valid JSON object matching the exact structure below.
      - ALL dates (startDate, endDate) MUST be strictly formatted as \`YYYY-MM\` (e.g. "2020-01"). If only a year is given, default to \`YYYY-01\`. If a role is current, use the string "Present" for endDate.
      - For experience and projects, format the \`description\` field using standard raw HTML tags (e.g. <ul>, <li>, <b>, <p>). Do NOT use plain text bullet points. This ensures the text can be parsed perfectly by a Rich Text Editor.
      - Extract any hidden URLs from the annotations list at the bottom and match them to the correct project or experience description, wrapping them in <a href="..."> tags.
      
      Expected JSON Structure:
      {
        "personalInfo": {
          "fullName": "string",
          "jobTitle": "string",
          "email": "string",
          "phone": "string",
          "location": "string",
          "website": "string",
          "github": "string",
          "linkedin": "string",
          "summary": "string"
        },
        "experience": [
          {
            "id": "string (generate a random numeric string)",
            "company": "string",
            "position": "string",
            "startDate": "YYYY-MM",
            "endDate": "YYYY-MM or Present",
            "current": boolean,
            "description": "string (PRESERVE bullet points using • and \\n)"
          }
        ],
        "education": [
          {
            "id": "string (generate a random numeric string)",
            "institution": "string",
            "degree": "string",
            "field": "string",
            "startDate": "string",
            "endDate": "string"
          }
        ],
        "skills": [
          {
            "id": "string (generate a random numeric string)",
            "name": "string",
            "category": "string (MUST be one of: Frontend, State Management, UI Libraries, Testing, Backend & APIs, Databases, Architecture & Performance, Tools, Other)"
          }
        ],
        "projects": [
          {
            "id": "string (generate a random numeric string)",
            "title": "string",
            "description": "string (PRESERVE bullet points and separate with \\n)",
            "link": "string"
          }
        ],
        "openSource": [
          {
            "id": "string (generate a random numeric string)",
            "project": "string",
            "role": "string",
            "description": "string (PRESERVE bullet points and separate with \\n)",
            "link": "string"
          }
        ]
      }

      Here is the resume text:
      ---
      ${text}
      ---
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from the response
    const cleanJson = responseText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ data: parsedData });

  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume text', details: error.message },
      { status: 500 }
    );
  }
}
