export const ADD_CONTACT = "ADD_CONTACT";
export const REMOVE_CONTACT = "REMOVE_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";

export const createContact = contact => ({
  type: ADD_CONTACT,
  contact
});

export const removeContact = contact => ({
  type: REMOVE_CONTACT,
  contact
});

export const updateContact = contact => ({
  type: UPDATE_CONTACT,
  contact
});
