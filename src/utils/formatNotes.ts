// Helper function to format notes into full sentences
export function formatNotes(notes: string): string {
  if (!notes) return '';

  // Split by commas if multiple notes exist
  const notesList = notes.split(',').map(note => note.trim());

  // Format each note
  return notesList
    .map(note => {
      // Ensure the note starts with a capital letter
      note = note.charAt(0).toUpperCase() + note.slice(1);
      
      // Add a period if it doesn't end with one
      if (!note.endsWith('.')) {
        note += '.';
      }
      
      return note;
    })
    .join(' ');
}