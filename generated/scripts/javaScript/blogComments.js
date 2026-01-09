"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// TODO Change for production
// const API_BASE = Raspberry Pi IP address/comments
const API_BASE = "http://127.0.0.1:5000";
const postId = window.location.pathname;
const commentList = document.getElementById("comment-list");
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
    .then((fetchResponse) => {
    if (!fetchResponse.ok) {
        // This handles HTTP errors (404, 500, etc.)
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
    }
    return fetchResponse.json();
})
    /*
    * Promises always resolve in the next then call. Thus the type of our argument comments becomes Blog_Comments[]
    * This is our last call so now we resolve what we want to do with our argument. In a lot of cases, its to alter
    * our HTML in some way programmatically. */
    .then((comments) => {
    let comment_list = document.getElementById("comment-list");
    if (comment_list === null) {
        throw new Error("comment-list html element not found.");
    }
    if (comments.length === 0) {
        comment_list.innerHTML = "<p>No comments yet. Be the first to comment!</p>";
    }
    else {
        comment_list.innerHTML =
            comments.map((blog_comment_element) => `<p><b>${blog_comment_element.author}</b></br> ${blog_comment_element.text}</p>`).join("");
    }
})
    // Use this block to catch any errors that may occur with the above processes
    // Unknown types cannot be used to do anything
    .catch((error) => {
    console.error("ERROR: ", error);
    if (error === "comment-list html element not found.\n") {
        console.error(error);
    }
    else {
        const commentList = document.getElementById("comment-list");
        if (commentList) {
            commentList.innerHTML =
                "<p>Failed to load comments. Please try again later.</p>";
        }
    }
});
let comment_list = document.getElementById("comment-form");
try {
    if (comment_list === null) {
        throw new Error("comment-list html element not found.\n");
    }
    else {
        comment_list.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            const form = e.target;
            if (form === null) {
                throw new Error("Form is null.\n");
            }
            else {
                yield fetch(`${API_BASE}/comments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        post: postId,
                        author: form.author.value,
                        text: form.text.value
                    })
                });
                location.reload();
            }
        }));
    }
}
catch (error) {
    console.error("ERROR: ", error);
    if (error === "comment-list html element not found.") {
        console.error(error);
    }
}
