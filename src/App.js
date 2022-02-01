import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const mainBody = css`
  width: auto;
  min-height: 90vh;
  justify-content: center;
`;

const inputTheGuest = css`
  line-height: 35px;
  margin-bottom: 15px;
  margin-top: 0.4rem;
`;

const title = css`
  font-size: 1.5rem;
`;

const button = css`
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 14px;
  margin-left: 0.5rem;
  padding: 10px 20px;
`;

const table = css`
  min-width: 30%;
  margin-left: auto;
  margin-right: auto;
  text-align: center !important;
  line-height: 30px;
  border-spacing: 15px 5px;
  margin-bottom: 25px;
  padding: 30px;
  border: 0.1rem solid rgb(0, 100, 0);
`;

function App() {
  const baseUrl = 'http://api-guest-list.herokuapp.com/guests';
  // Define the guestList array
  const [guestList, setGuestList] = useState([]);
  // Guest List input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getGuestList = async () => {
      const response = await fetch(`${baseUrl}/`);
      const guestsData = await response.json();
      setGuestList(guestsData);
      setIsLoading(false);
    };
    getGuestList().catch((error) => {
      console.error(error);
    });
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Create a new guest with POST method
    async function addNewGuest() {
      const response = await fetch(`${baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
        }),
      });

      const createdGuest = await response.json();
      console.log(createdGuest);
      window.location.reload();
      return createdGuest;
    }

    addNewGuest().catch((error) => {
      console.error(error);
    });
  }

  // Update guest status with PUT method
  function handleUpdate(id, attending) {
    async function updateGuestStatus() {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attending: !attending,
        }),
      });

      const updatedGuest = await response.json();
      console.log(updatedGuest);

      window.location.reload();
      return updatedGuest;
    }
    updateGuestStatus().catch((error) => {
      console.error(error);
    });
  }

  // Delete guest with DELETE method
  function handleDelete(id) {
    async function deleteGuest() {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });

      const deletedGuest = await response.json();
      console.log(deletedGuest);

      window.location.reload();
      return deletedGuest;
    }
    deleteGuest().catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className="bodyContainer" data-test-id="guest">
      <h1>GUEST LIST</h1>
      <section css={mainBody}>
        <div>
          <h2>Would like to invite </h2>

          {/* Guests First and Last Name Input */}
          <form onSubmit={handleSubmit}>
            <span>First name </span>
            <input
              css={inputTheGuest}
              id="firstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span>Last name </span>
            <input
              css={inputTheGuest}
              id="lastName"
              onChange={(e) => setLastName(e.target.value)}
            />
            <button css={button}>Add Guest</button>
          </form>
        </div>
        <div>
          {/* Guest list Table */}
          <h2> Guest list</h2>
          <table css={table}>
            <tbody>
              <tr>
                <th css={title}>Attending</th>
                <th css={title}>Guest Name</th>
              </tr>
              {guestList.map((guest) => {
                return (
                  <tr key={guest.id}>
                    <td>
                      {guest.attending ? 'Attending' : 'Not attending'}
                      <input
                        type="checkbox"
                        aria-label="attending"
                        checked={guest.attending}
                        onChange={() => {
                          handleUpdate(guest.id, guest.attending);
                          console.log(guest);
                        }}
                      />
                    </td>

                    <td>
                      {' '}
                      {guest.firstName} {guest.lastName}{' '}
                    </td>
                    <button
                      css={button}
                      type="button"
                      onClick={() => handleDelete(guest.id)}
                      aria-label="Remove"
                    >
                      Remove
                    </button>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
