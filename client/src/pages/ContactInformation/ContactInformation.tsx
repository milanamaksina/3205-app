import { FC, useState } from "react";
import "./ContactInformation.scss";
import ContactForm from "../../components/ContactForm";
import { Contact } from "../../models/contact";

export const ContactInformation: FC = () => {
  const [users, setUsers] = useState<Contact[]>([]);

  console.log("users", users);

  return (
    <div className="card">
      <h1>Welcome!</h1>
      <h2>Get user by entering the information below</h2>
      <ContactForm setUsers={setUsers} />
      {users?.length > 0 ? (
        <>
          <h2>Users with the same data:</h2>
          {users.map((user, index) => (
            <div key={index}>
              {user.email} {user.number}
            </div>
          ))}
        </>
      ) : (
        <h2>No users with the same data</h2>
      )}
    </div>
  );
};

export default ContactInformation;
