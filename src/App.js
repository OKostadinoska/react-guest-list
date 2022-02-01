import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const mainBody = css`
  width: auto;
  min-height: 90vh;
  justify-content: center;
`;
const headerTitle = css`
  background-color: aliceblue;
`;
const inputTheGuest = css`
  line-height: 35px;
  margin-bottom: 15px;
  margin-top: 0.4rem;
  padding-left: 5rem;
  border-radius: 0.5rem;
`;

const title = css`
  font-size: 1.5rem;
`;

const button = css`
  background-color: #957dad;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 14px;
  margin-left: 0.5rem;
  padding: 10px 20px;
`;

const table = css`
  min-width: 30%;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center !important;
  line-height: 30px;
  border-spacing: 15px 5px;
  margin-bottom: 25px;
  padding: 30px;
  border: 0.1rem solid #e4eade;
  border-radius: 0.2rem;
`;

function App() {
  const baseUrl = 'http://api-guest-list.herokuapp.com';
  // Define the guestList array
  const [guestList, setGuestList] = useState([]);
  // Guest List input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getGuestList = async () => {
      const response = await fetch(`${baseUrl}/guests`);
      const guestsData = await response.json();
      setGuestList(guestsData);
      setIsLoading(false);
    };
    getGuestList().catch((error) => {
      console.error(error);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    // Create a new guest with POST method
    async function addNewGuest() {
      const response = await fetch(`${baseUrl}/guests`, {
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
      const response = await fetch(`${baseUrl}/guests/${id}`, {
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
      const response = await fetch(`${baseUrl}/guests/${id}`, {
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
      <h1 css={headerTitle}>GUEST LIST</h1>
      <section css={mainBody}>
        <div>
          <h2>Would like to invite </h2>

          {/* Guests First and Last Name Input */}
          <form onSubmit={handleSubmit}>
            <label text="First name">
              First name
              <input
                css={inputTheGuest}
                label="First name"
                disabled={isLoading}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>
            <label text="Last name">
              Last name
              <input
                css={inputTheGuest}
                label="Last name"
                disabled={isLoading}
                onChange={(event) => setLastName(event.target.value)}
              />
            </label>
            <button css={button}>Add guest</button>
          </form>
        </div>
        <div text="Loading...">
          {/* Guest list Table */}

          <table css={table}>
            <tbody>
              <tr>
                <th css={title}>Attending</th>
                <th css={title}>Guest Name</th>
              </tr>
              {isLoading ? 'Loading...' : ''}
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
