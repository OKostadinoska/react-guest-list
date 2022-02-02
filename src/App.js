import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const headerTitle = css``;

const mainBody = css`
  width: auto;
  min-height: 90vh;
  justify-content: center;
  align-items: center;
`;

const inputTheGuest = css`
  line-height: 35px;
  margin-bottom: 15px;
  margin-top: 0.4rem;
  margin-left: 0.3rem;
  padding-left: 5rem;
  border-radius: 0.5rem;
  align-items: center;
`;

const title = css`
  font-size: 1.5rem;
`;

const button = css`
  background-color: #90ee90;
  letter-spacing: 1px;
  font-size: 13px;
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

const buttonRemove = css`
  background-color: #f08080;
  letter-spacing: 1px;
  font-size: 13px;
  margin-left: 0.5rem;
  padding: 10px 20px;
`;

function App() {
  const baseUrl = 'https://api-guest-list.herokuapp.com';
  // Define the allData
  const [guestList, setGuestList] = useState();
  // Guest List input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // Define newUser
  const [newUser, setNewUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Get list with all guests
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
  }, [newUser]);

  function handleSubmit(e) {
    e.preventDefault();

    // Create a new guest with POST method
    const addNewGuest = async () => {
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: firstName, lastName: lastName }),
      });
      const createdGuest = await response.json();
      setFirstName('');
      setLastName('');
      setNewUser(createdGuest);
    };
    addNewGuest().catch((error) => {
      console.error(error);
    });
  }

  // Delete guest with DELETE method
  function handleDelete(id) {
    const deleteGuest = async () => {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedUser = await response.json();
      setNewUser(deletedUser);
    };
    deleteGuest().catch((error) => {
      console.error(error);
    });
  }

  // Update guest status with PUT method
  function handleUpdate(id) {
    const updateGuestStatus = async () => {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: true }),
      });
      const updatedGuest = await response.json();
      setNewUser(updatedGuest);
    };
    updateGuestStatus().catch((error) => {
      console.error(error);
    });
  }

  // Show a loading message if data is not fully fetched from the server
  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="bodyContainer" data-test-id="guest">
        <h1 css={headerTitle}>GUEST LIST</h1>
        <section css={mainBody}>
          <form onSubmit={handleSubmit}>
            <label>
              First name
              <input
                value={firstName}
                css={inputTheGuest}
                disabled={isLoading}
                onChange={(event) => setFirstName(event.currentTarget.value)}
              />
            </label>

            <label>
              Last name
              <input
                value={lastName}
                css={inputTheGuest}
                disabled={isLoading}
                onChange={(event) => setLastName(event.currentTarget.value)}
              />
            </label>

            <button css={button}>Add guest</button>
          </form>
          <div>
            {/* Guest list Table */}
            <table css={table}>
              <thead>
                <tr>
                  <th css={title}>Attending</th>
                  <th css={title}>Guest Name</th>
                </tr>
              </thead>
              <tbody>
                {guestList.map((guest) => {
                  return (
                    <tr key={guest.id}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label="Attending"
                          defaultChecked={guest.attending}
                          onChange={() => {
                            handleUpdate(guest.id, guest.attending);
                            console.log(guest);
                          }}
                        />
                      </td>
                      <td>
                        {guest.firstName} {guest.lastName}{' '}
                      </td>
                      <td>
                        <button
                          css={buttonRemove}
                          type="button"
                          aria-label="Remove"
                          onClick={() => {
                            handleDelete(guest.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
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
}

export default App;
