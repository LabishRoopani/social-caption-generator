import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
  try {
    const body = await request.json();
    const { description, tone } = body;

    // Basic validation
    if (!description || !tone) {
      return Response.json(
        { error: 'Description and tone are required fields.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'Gemini API Key is missing. Please check your .env file.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const prompt = `
      You are an expert social media manager.
      Generate exactly 5 distinct social media caption variants for the following product/service.
      
      Product/Service Description: "${description}"
      Desired Tone: ${tone}
      
      Guidelines:
      - The captions must strictly follow the requested tone.
      - Each caption must be unique and engaging.
      - Include 3 to 5 relevant hashtags at the end of each caption.
      - Format the output strictly as a JSON array of strings, where each string is a complete caption including the hashtags. Do not include any markdown formatting like \`\`\`json or \`\`\`.
      
      Example output format:
      [
        "Experience luxury in every stitch... #Luxury #Style",
        "Elevate your everyday carry... #Premium #Wallet"
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
  
    const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
    
    let captions;
    try {
      captions = JSON.parse(jsonString);
      if (!Array.isArray(captions)) {
        throw new Error("Parsed output is not an array");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", responseText);
      return Response.json(
        { error: 'Failed to parse the generated captions. Please try again.' },
        { status: 500 }
      );
    }

    return Response.json({ captions }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: 'An internal server error occurred while generating captions.' },
      { status: 500 }
    );
  }
}
