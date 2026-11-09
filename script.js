const MODEL="qwen3.6:35b-a3b";

let chat = document.getElementById("chat");
let box = document.getElementById("box");
let btn = document.getElementById("btn");



function show(text,who){
    
    const line=document.createElement("div");
    line.className = who;           
    line.textContent = text;
    chat.appendChild(line);
    chat.scrollTop = chat.scrollHeight;

}

let chatHistory=[];

async function sendtext() {
    const text = box.value.trim();
    if (text === "") {
        alert("Empty text sent");
        return;
    }    
    show(text,"user");
    chatHistory.push({role: "user" ,content: text});
    box.value ="";

    try{
        const response= await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: MODEL,
            messages: chatHistory,
            stream: false
            })
        });  

        const data= await response.json();
        const qwenOutput=data.message.content;

        show(qwenOutput,"bot");
        chatHistory.push({role: data.message.role, content: qwenOutput});

    }catch (error){
        show("Oops ran into some error ", "bot");
        console.log(error);
    }
}
btn.addEventListener("click",sendtext);
box.addEventListener("keydown",function (event){
    if(event.key==="Enter") sendtext();
    });
