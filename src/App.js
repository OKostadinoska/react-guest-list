import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const baseUrl = 'http://api-guest-list.herokuapp.com/guests';

const mainStyle = css`
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
  // Define the guestList array
  const [guestList, setGuestList] = useState();
  // Guest List input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // 1. Set State variable that control the input
  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Object.keys() returns an array of strings which are values of specific key of the object
  const checkboxKeys = Object.keys(isChecked);

  // fetch gets API from the server, will rerender nonStop, in this case runs only once because of useEffect
  useEffect(() => {
    const getList = async () => {
      const response = await fetch(`${baseUrl}/`);
      const data = await response.json();
      setGuestList(data);
      setIsLoading(false);
    };
    getList().catch((error) => {
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

  // when Submit button is clicked
  function handleSubmit(e) {
    e.preventDefault();

    // create a new guest "POST"
    async function newGuest() {
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
      window.location.reload();
      return createdGuest;
    }

    newGuest().catch((error) => {
      console.error(error);
    });
  }

  // Delete button is clicked "DELETE"

  function handleDelete() {
    async function deleteGuest() {
      const response = await fetch(`${baseUrl}/${checkboxKeys}`, {
        method: 'DELETE',
      });

      const deletedGuest = await response.json();

      window.location.reload();
      return deletedGuest;
    }
    deleteGuest().catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className="bodyContainer" data-test-id="guest">
      <header>
        <h1>GUEST LIST</h1>
      </header>
      <section css={mainStyle}>
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
              {guestList.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="attending"
                      checked={isChecked[guest.id]}
                      // onClick={(e) => handleEdit(e)}
                      onChange={(e) => {
                        setIsChecked(e.currentTarget.checked, {
                          ...(isChecked ? [guest.id] : false),
                        });
                        console.log(isChecked);
                      }}
                    />
                  </td>
                  <td>
                    {' '}
                    {guest.firstName} {guest.lastName}{' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            css={button}
            type="button"
            onClick={(guest) => handleDelete(guest.id)}
            aria-label="Remove"
          >
            Remove
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
