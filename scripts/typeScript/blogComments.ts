// TODO Change for production
// const API_BASE = Raspberry Pi IP address/comments
const API_BASE = "http://127.0.0.1:5000";
const postId = window.location.pathname;
const commentList = document.getElementById("comment-list");

/*

*  
* 
*  
* 
*/

/* 
* Interfaces allow us to Shape a return value. API calls have a type of any by default
* but if narrow its return type to something, we can then begin typing it.
* Thus we have narrowed fetchResponse.json() to return Promise<Blog_Comments[]> */
interface Blog_Comment {
    author: string;
    text: string;
}

/*
* Fetch uses async and await
* It attempts to fetch whatever file you pass as a str, URL, or Request
* then it populates the argument of the .then() call. In this case
* our fetchResponse argument. There is no need to explicitly type this as it
* already has very defined inputs and a single return type */
fetch(`${API_BASE}/comments?post=${postId}`)
/* 
* Note: I have explicitly typed this fetchResponse argument for beginner friendly reading, 
* but typeScript can usually infer the type of Promise it is. 
* This then returns the value after the => which is a javaScript Promise of an Array of 
* our Interface we declared above */
.then((fetchResponse: Response): Promise<Blog_Comment[]> => (fetchResponse.json()))
/*
* Promises always resolve in the next then call. Thus the type of our argument comments becomes Blog_Comments[]
* This is our last call so now we resolve what we want to do with our argument. In a lot of cases, its to alter
* our HTML in some way programmatically. */
.then((comments : Blog_Comment[]) => {
    if (comments.length === 0) {
        document.getElementById("comment-list").innerHTML = "<p>No comments yet. Be the first to comment!</p>";
    } else {
        document.getElementById("comment-list").innerHTML =
            comments.map((blog_comment_element : Blog_Comment): string => 
            `<p><b>${blog_comment_element.author}</b></br> ${blog_comment_element.text}</p>`).join("");
    }
})
// Use this block to catch any errors that may occur with the above processes
// Unknown types cannot be used to do anything
.catch((error: unknown) => { 
    console.error("ERROR: ", error);
    
    const commentList : HTMLElement = document.getElementById("comment-list");
    if (commentList) {
        commentList.innerHTML =
            "<p>Failed to load comments. Please try again later.</p>";
    }
});

document.getElementById("comment-form").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target;

    await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            post: postId,
            author: form.author.value,
            text: form.text.value
        })
    });
    location.reload();
});