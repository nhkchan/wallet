import React, { Component } from "react";
import { connect } from "react-redux";
import { filter, sortBy } from "lodash";

import Header from "../ContentPrimaryHeader";
import Contact from "./Contact";

import styles from "./ContactList.css";

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: "",
      contacts: this.props.contacts
    };
  }

  filterContacts = e => {
    let filtered = this.props.contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        contact.address.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });

    this.setState({
      contacts: filtered
    });
  };

  componentDidMount() {
    this.props.loadContacts();
  }

  renderContacts() {
    let { searchString } = this.props;
    let { contacts } = this.state;

    contacts = filter(
      contacts,
      c => c.url.toUpperCase().indexOf(searchString) !== -1
    );
    contacts = sortBy(contacts, c => c.url);

    return (
      <div className={styles.votesContainer}>
        {contacts.length < 1 ? (
          <div className={styles.noResults}>No Witnesses Found</div>
        ) : (
          ""
        )}
        {contacts.map((contact, index) => (
          <Contact
            key={index}
            walletName={contact.name}
            walletAddress={contact.address}
          />
        ))}
      </div>
    );
  }

  render() {
    let { contacts } = this.props;

    return (
      <div className={styles.container}>
        <Header className={styles.header} text="MY CONTACTS :" />
        <input
          className={styles.input}
          placeholder="Search Contacts..."
          onChange={this.filterContacts}
        />
        {this.renderContacts()}
      </div>
    );
  }
}

export default connect(
  state => ({
    contacts: state.contacts.contacts,
    searchString: state.app.searchString
  }),
  dispatch => ({
    loadContacts: () => {
      dispatch(loadContacts(dispatch));
    }
  })
)(ContactList);
