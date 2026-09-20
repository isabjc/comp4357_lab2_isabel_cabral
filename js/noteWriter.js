/*
 * COMP 4537 Lab 2
 * NoteWriter class
 *
 * ChatGPT was used as a learning aid for understanding
 * OOP, JSON serialization, localStorage, and DOM events.
 */

import { USER_MESSAGES } from "../lang/messages/en/user.js";

import {
    STORAGE_KEY,
    SAVE_INTERVAL_MS
} from "./config.js";

import { Note } from "./Note.js";


export class NoteWriter {

    constructor() {

        // Array containing all Note objects
        this.notes = [];

        // Tracks whether notes have changed since the last save
        this.hasChanges = false;

        // Get the required HTML elements
        this.notesContainer =
            document.getElementById("notes-container");

        this.addButton =
            document.getElementById("add-button");

        this.saveStatus =
            document.getElementById("save-status");

        this.pageTitle =
            document.getElementById("page-title");

        this.backLink =
            document.getElementById("back-link");

        // Initialize the writer page
        this.initialize();
    }


    initialize() {

        // Set the user-facing messages
        this.pageTitle.textContent =
            USER_MESSAGES.WRITER_TITLE;

        this.addButton.textContent =
            USER_MESSAGES.ADD_NOTE;

        this.backLink.textContent =
            USER_MESSAGES.BACK;

        this.saveStatus.textContent =
            `${USER_MESSAGES.LAST_SAVED} ${USER_MESSAGES.NEVER_SAVED}`;

        // Add a new note when the Add button is clicked
        this.addButton.addEventListener("click", () => {

            this.addNote();

        });

        // Load existing notes from localStorage
        this.loadNotes();

        // Check for changes every two seconds
        setInterval(() => {

            if (this.hasChanges) {

                this.saveNotes();

            }

        }, SAVE_INTERVAL_MS);

        // Save pending changes before leaving the page
        window.addEventListener("pagehide", () => {

            if (this.hasChanges) {

                this.saveNotes();

            }

        });
    }


    addNote(content = "", existingId = null) {

        // Reuse an existing ID or generate a new one
        const noteId = existingId ?? crypto.randomUUID();

        // Create a new Note object
        const note = new Note(

            noteId,

            content,

            (id) => {
                this.removeNote(id);
            },

            () => {
                this.markAsChanged();
            }

        );

        // Add the Note object to the array
        this.notes.push(note);

        // Display the note on the webpage
        note.render(this.notesContainer);

        // Mark the notes as changed
        this.markAsChanged();
    }


    removeNote(noteId) {

        // Keep every note except the one being removed
        this.notes = this.notes.filter((note) => {

            return note.id !== noteId;

        });

        // Save immediately after removing a note
        this.saveNotes();
    }


    markAsChanged() {

        // Indicate that the current notes need to be saved
        this.hasChanges = true;
    }


    saveNotes() {

        // Convert Note instances into plain JavaScript objects
        const noteData = this.notes.map((note) => {

            return note.getData();

        });

        // Serialize the array of objects into JSON
        const notesJson = JSON.stringify(noteData);

        // Store the JSON string in localStorage
        localStorage.setItem(STORAGE_KEY, notesJson);

        // Reset the change tracker after saving
        this.hasChanges = false;

        // Display the latest save time
        this.updateSaveTime();
    }


    loadNotes() {

        // Retrieve the JSON string from localStorage
        const storedNotes = localStorage.getItem(STORAGE_KEY);

        // No notes have been saved yet
        if (storedNotes === null) {

            return;

        }

        // Convert the JSON string into JavaScript objects
        const parsedNotes = JSON.parse(storedNotes);

        // Recreate every previously saved note
        for (const storedNote of parsedNotes) {

            this.addNote(
                storedNote.content,
                storedNote.id
            );

        }

        // Loading existing notes does not count as editing
        this.hasChanges = false;
    }


    updateSaveTime() {

        // Get the current local time
        const currentTime = new Date().toLocaleTimeString();

        // Display the time in the top-right corner
        this.saveStatus.textContent =
            `${USER_MESSAGES.LAST_SAVED} ${currentTime}`;
    }

}