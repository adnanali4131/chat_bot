let url = "https://api.openai.com/v1/chat/completions";

// add your token in auth to run this bot

export async function fetchOpenGptData(input) {
  const details=[{
    content:input,
    role:"user"
  }]
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${""}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",  
      messages: details,
    })
  });

  if (!res.ok) {
    throw new Error("Error");
  }
  
  const data = await res.json();
  return data;
}


