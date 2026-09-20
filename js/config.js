
/*
 * COMP 4537 Lab 2
 * Shared application configuration
 *
 * ChatGPT was used as a learning aid.
 */

// LocalStorage configuration
export const STORAGE_KEY = "notes";

// Time configuration
const MILLISECONDS_PER_SECOND = 1000;

const SAVE_INTERVAL_SECONDS = 2;
const RETRIEVE_INTERVAL_SECONDS = 2;

export const SAVE_INTERVAL_MS =
    SAVE_INTERVAL_SECONDS * MILLISECONDS_PER_SECOND;

export const RETRIEVE_INTERVAL_MS =
    RETRIEVE_INTERVAL_SECONDS * MILLISECONDS_PER_SECOND;

// Textarea configuration
export const TEXTAREA_ROWS = 5;
export const TEXTAREA_COLUMNS = 40;