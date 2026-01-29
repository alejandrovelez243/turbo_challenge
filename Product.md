# **Product Requirements Document (PRD)**

**Project:** Note Taking App (Aesthetic Notes)

**Version:** 1.0

**Status:** Initial Draft

## **1\. Executive Summary**

The objective is to develop a web-based note-taking application focused on simplicity and aesthetics. The application allows users to organize their thoughts into predefined categories with a clean visual interface, pastel colors, and automatic saving.

## **2\. Functional Requirements**

### **2.1 Authentication Module**

The system must allow secure entry for new and recurring users.

**2.1.1 Sign Up**

* **Fields:**
  * Email address.
  * Password.
* **Functionalities:**
  * "Eye" button to toggle password visibility (show/hide).
  * "Sign Up" button to complete registration.
  * Link "We're already friends" to redirect to Login.

**2.1.2 Login**

* **Fields:** Identical to registration.
* **Functionalities:**
  * "Login" button to access.
  * Link "Oops\! I've never been here before" to redirect to Sign Up.

### **2.2 Dashboard (Main Screen)**

This is the navigation hub. It shows the summary of notes and filtering tools.

**2.2.1 Empty State**

* **Condition:** Shown when the user is new or has no active notes.
* **Visual Elements:** Friendly central illustration and welcome message ("I'm just here waiting for your charming notes...").
* **Behavior:** The sidebar with categories must remain visible even if there are no notes.

**2.2.2 Sidebar**

* **Default Categories:** Upon account creation, these must be automatically generated:
  1. Random Thoughts.
  2. School.
  3. Personal.
* **Counters:** Each category must show the total number of notes it contains to its right.
* **Filter:**
  * Selecting a category filters the main view to show only those notes.
  * Option "All Categories" to reset the view.

**2.2.3 Note Creation**

* **Action Button:** A prominent "+ New Note" button must always be accessible in the top right corner.

### **2.3 Note Editor**

Interface for content creation and modification.

**2.3.1 Creation Flow**

* **No save button:** Saving is automatic in real-time.
* Clicking "+ New Note" immediately opens the note canvas.

**2.3.2 Note Structure**

* **Category Selector:** Dropdown menu at the top. Allows changing the category of the current note.
* **Title:** Editable text field.
* **Body:** Multi-line text area for the main content.
* **Metadata:** "Last Edited" indicator showing date and time, updating as the user types.

**2.3.3 Visual Behavior (Color Coding)**

* **Color Rule:** The note background changes dynamically based on the selected category.
  * *Random Thoughts:* Soft Orange/Peach tone.
  * *School:* Soft Yellow tone.
  * *Personal:* Soft Green tone.

**2.3.4 Closing**

* "X" button to close the editor and return to the Dashboard.

### **2.4 Note Visualization (Cards)**

Existing notes are displayed as preview cards on the dashboard.

**2.4.1 Card Anatomy**

* **Header:** Last edited date (left) and Category name (right).
* **Body:** Note title in bold.
* **Content:** Snippet of the note body.

**2.4.2 Date Format Rules (Business Logic)**

* **Today:** Display text "today".
* **Yesterday:** Display text "yesterday".
* **Older:** Display format "Month Day" (e.g., July 15).
* **Restriction:** **Do not** display the year on any card.

**2.4.3 Text Truncation**

* If the note content exceeds the card space, the text must be truncated with ellipses (...) to maintain uniform card height.

**2.4.4 Editing**

* Clicking on any card opens the Note Editor (point 2.3) with the information loaded and ready to edit.

## **3\. Non-Functional Requirements (UI/UX)**

* **Aesthetics:** Minimalist design, use of rounded corners on buttons and cards.
* **Typography:** Clean and legible fonts (Sans Serif).
* **Feedback:** Interactions (buttons, text fields) must have clear states (hover, focus).
* **Responsiveness:** The application must adapt to different screen sizes (Desktop and Tablet suggested by the video).
