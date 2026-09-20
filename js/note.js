/*
 * COMP 4537 Lab 2
 * Note class
 *
 * ChatGPT was used as a learning aid for understanding
 * OOP, DOM manipulation, and JavaScript classes.
 */

import { USER_MESSAGES } from "../lang/messages/en/user.js";

import {
    TEXTAREA_ROWS,
    TEXTAREA_COLUMNS
} from "./config.js";


export class Note {

    constructor(id, content, onRemove, onChange) {

        // Properties belonging to this note
        this.id = id;
        this.content = content;

        // Callback functions provided by NoteWriter
        this.onRemove = onRemove;
        this.onChange = onChange;

        // Create this note's HTML elements
        this.container = document.createElement("div");

        this.textArea = document.createElement("textarea");

        this.removeButton = document.createElement("button");

        // Configure the elements
        this.createNoteElement();
    }


    createNoteElement() {

        // Add CSS class to the note container
        this.container.classList.add("note");

        // Configure the textarea
        this.textArea.rows = TEXTAREA_ROWS;

        this.textArea.cols = TEXTAREA_COLUMNS;

        this.textArea.value = this.content;

        // Configure the Remove button
        this.removeButton.type = "button";

        this.removeButton.textContent =
            USER_MESSAGES.REMOVE_NOTE;

        // Detect changes to the note's content
        this.textArea.addEventListener("input", () => {

            this.onChange();

        });

        // Remove this note when its button is clicked
        this.removeButton.addEventListener("click", () => {

            this.remove();

        });

        // Place the textarea and button inside the container
        this.container.appendChild(this.textArea);

        this.container.appendChild(this.removeButton);
    }


    remove() {

        // Remove this note's HTML elements from the page
        this.container.remove();

        // Tell NoteWriter which note was removed
        this.onRemove(this.id);
    }


    getData() {

        // Return a plain JavaScript object
        // containing only the data we want to store

        return {
            id: this.id,
            content: this.textArea.value
        };
    }


    render(parentElement) {

        // Display this note inside the specified container
        parentElement.appendChild(this.container);
    }

}