import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, content } = await req.json()

    const prompt = `Reflect deeply on the user's journal entry, focusing on their specific emotions, experiences, and challenges.
    Relate their situation to the teachings of the Bhagavad Gita, using concepts such as dharma (duty), karma (selfless action), detachment, balance, and equanimity. The goal is to connect the Gita's wisdom to the user's particular context in a way that feels personal and practical.

    Start by acknowledging the user's experience in detail—highlight specific aspects of what they shared to show understanding. Then, relate these details to relevant verses from the Gita and their philosophical insights. Finally, offer guidance or suggestions tailored to their situation, ensuring it resonates with their entry.

    Avoid generalized advice; instead, directly address the user's reflections and show how the teachings can illuminate their path forward. Focus on how the Gita can provide clarity or comfort in their unique moment.

    Now, based on these guidelines, respond to the following journal entry:

    Title: ${title}
    Entry: ${content}`

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    const data = await response.json()
    console.log('Groq API Response:', data)

    return new Response(
      JSON.stringify({ analysis: data.choices[0].message.content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})