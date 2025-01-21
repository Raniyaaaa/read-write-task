const http=require('http')
const fs=require("fs")

const server=http.createServer((req,res)=>{
    const url=req.url;
    const method=req.method;

    if(url==='/'){
        res.setHeader("Content-Type",'text/html');
        res.end(`
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username"></input>
                <button type="submit">Add</button>
            </form>
        `)
    }
    else{
        if(url=='/message'){
            let body=[];
            req.on("data", (chunks)=>{
                body.push(chunks)
            })
            req.on("end", ()=>{
                let buffer= Buffer.concat(body)
                console.log(buffer)

                let formData = buffer.toString()
                console.log(formData)

                const formvalues=formData.split('=')[1];

                fs.writeFile('formvalues.txt',formvalues, (err)=>{
                    res.statusCode=302;
                    res.setHeader('Location','/')
                    res.end();
                })
                
            })
        }
        else{
            if(req.url=='/read'){
                fs.readFile('formvalues.txt',(err,data)=>{
                    console.log(data.toString())
                    res.end(`<h1>${data.toString()}</h1>`)
                })
            }
        }
    }
})

server.listen(3000, ()=>{
    console.log("Server is running")
})