/*
 * COMP 4537 Lab 2
 * NoteReader class
 *
 * ChatGPT was used as a learning aid for understanding
 * JSON parsing, localStorage, and DOM manipulation.
 */

import { USER_MESSAGES } from "../lang/messages/en/user.js";

import {
    STORAGE_KEY,
    RETRIEVE_INTERVAL_MS
} from "./config.js";


class ReadOnlyNote {

    constructor(content) {

        this.content = content;

        this.element = document.createElement("div");

        this.createElement();
    }


    createElement() {

        this.element.classList.add("reader-note");

        this.element.textContent = this.content;
    }


    render(parentElement) {

        parentElement.appendChild(this.element);
    }

}


export class NoteReader {

    constructor() {

        // Get the required HTML elements
        this.notesContainer =
            document.getElementById("notes-container");

        this.retrieveStatus =
            document.getElementById("retrieve-status");

        this.pageTitle =
            document.getElementById("page-title");

        this.backLink =
            document.getElementById("back-link");

        // Initialize the reader page
        this.initialize();
    }


    initialize() {

        // Set the user-facing messages
        this.pageTitle.textContent =
            USER_MESSAGES.READER_TITLE;

        this.backLink.textContent =
            USER_MESSAGES.BACK;

        this.retrieveStatus.textContent =
            `${USER_MESSAGES.LAST_RETRIEVED} ${USER_MESSAGES.NEVER_RETRIEVED}`;

        // Retrieve existing notes immediately
        this.loadNotes();

        // Retrieve notes every two seconds
        setInterval(() => {

            this.loadNotes();

        }, RETRIEVE_INTERVAL_MS);
    }


    loadNotes() {

        // Retrieve the JSON string from localStorage
        const storedNotes = localStorage.getItem(STORAGE_KEY);

        // Remove previously displayed notes
        this.notesContainer.replaceChildren();

        // Handle the case where no notes have been stored
        if (storedNotes === null) {

            this.displayEmptyMessage();

            this.updateRetrieveTime();

            return;
        }

        // Deserialize JSON into an array of objects
        const parsedNotes = JSON.parse(storedNotes);

        // Handle an empty notes array
        if (parsedNotes.length === 0) {

            this.displayEmptyMessage();

            this.updateRetrieveTime();

            return;
        }

        // Dynamically display each retrieved note
        for (const storedNote of parsedNotes) {

            const note = new ReadOnlyNote(storedNote.content);

            note.render(this.notesContainer);
        }

        // Display the latest retrieval time
        this.updateRetrieveTime();
    }


    displayEmptyMessage() {

        // Create a paragraph for the empty-state message
        const message = document.createElement("p");

        message.textContent = USER_MESSAGES.EMPTY_READER;

        this.notesContainer.appendChild(message);
    }


    updateRetrieveTime() {

        // Get the current local time
        const currentTime = new Date().toLocaleTimeString();

        // Display the retrieval time in the top-right corner
        this.retrieveStatus.textContent =
            `${USER_MESSAGES.LAST_RETRIEVED} ${currentTime}`;
    }

}