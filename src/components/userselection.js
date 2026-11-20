import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,
} from '@material-ui/core';

const legacyUsers = ['trainer 1', 'trainer 2', 'trainer 3', 'trainer 4'];
const usersKey = 'pokemon-users';
const lastUserKey = 'pokemon-last-username';

const loadPlayers = () => {
  try {
    const savedUsers = localStorage.getItem(usersKey);
    const users = savedUsers === null ? [] : JSON.parse(savedUsers);
    if (!Array.isArray(users) || users.some((name) => typeof name !== 'string' || !name.trim())) {
      throw new Error('Invalid saved player list');
    }

    const savedUsername = localStorage.getItem(lastUserKey);
    const lastUsername = savedUsername === null ? '' : JSON.parse(savedUsername);
    if (savedUsername !== null && (typeof lastUsername !== 'string' || !lastUsername.trim())) {
      throw new Error('Invalid saved player name');
    }
    if (savedUsers === null && (legacyUsers.includes(lastUsername) || legacyUsers.some((user) =>
      ['pokemon-', 'pokemoney-', 'configuration-', 'configuration-operation-']
        .some((prefix) => localStorage.getItem(`${prefix}${user}`) !== null)
    ))) {
      users.push(...legacyUsers);
    }
    const hasUsername = !lastUsername || users.includes(lastUsername);
    if (!hasUsername) {
      users.push(lastUsername);
    }
    if ((savedUsers === null && users.length > 0) || !hasUsername) {
      localStorage.setItem(usersKey, JSON.stringify(users));
    }
    const username = lastUsername || users[0] || '';
    return { users, username, error: '' };
  } catch (error) {
    console.error('Could not load players:', error);
    return { users: [], username: '', error: 'Could not load the saved players from browser storage.' };
  }
};

const UserSelect = ({ changeUser }) => {
  const [players, setPlayers] = useState(loadPlayers);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (players.username) changeUser(players.username);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectUser = (username, users = players.users) => {
    try {
      localStorage.setItem(lastUserKey, JSON.stringify(username));
    } catch (error) {
      console.error('Could not select player:', error);
      setPlayers((current) => ({ ...current, users, error: 'Could not save the selected player.' }));
      return false;
    }
    setPlayers({ users, username, error: '' });
    changeUser(username);
    return true;
  };

  const closeDialog = () => {
    setIsOpen(false);
    setName('');
    setFormError('');
  };

  const createPlayer = (event) => {
    event.preventDefault();
    const username = name.trim();
    if (!username) {
      setFormError('Enter a player name.');
      return;
    }
    if (players.users.some((user) => user.toLowerCase() === username.toLowerCase())) {
      setFormError('That player name already exists.');
      return;
    }
    // Table and operation settings share a storage key prefix.
    if (username === 'undefined' || username === 'operation-undefined' ||
        players.users.some((user) => username === `operation-${user}` || user === `operation-${username}`)) {
      setFormError('That name conflicts with saved settings. Choose another name.');
      return;
    }

    const users = [...players.users, username];
    try {
      localStorage.setItem(usersKey, JSON.stringify(users));
    } catch (error) {
      console.error('Could not save player:', error);
      setFormError('Could not save the player in browser storage.');
      return;
    }
    if (selectUser(username, users)) {
      closeDialog();
    } else {
      setFormError('Player saved, but could not be selected. Close this window and try selecting it.');
    }
  };

  return (
    <>
      <Box display="inline-flex" alignItems="center">
        {players.users.length > 0 && <FormControl variant="filled" fullWidth={false} error={Boolean(players.error)}>
          <InputLabel id="userselection">user</InputLabel>
          <Select
            labelId="userselection"
            id="userselection"
            label="userselection"
            value={players.username}
            onChange={(event) => selectUser(event.target.value)}
            disabled={players.users.length === 0}
          >
            {players.users.map((user) => (
              <MenuItem value={user} key={user}>{user}</MenuItem>
            ))}
          </Select>
          {players.error && <FormHelperText role="alert">{players.error}</FormHelperText>}
        </FormControl>}
        {players.users.length === 0 && players.error && <FormHelperText error role="alert">{players.error}</FormHelperText>}
        <Button size="small" onClick={() => setIsOpen(true)} disabled={players.users.length === 0 && Boolean(players.error)}>
          New player
        </Button>
      </Box>
      <Dialog open={isOpen} onClose={closeDialog} aria-labelledby="new-player-title">
        <form onSubmit={createPlayer}>
          <DialogTitle id="new-player-title">New player</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="new-player-name"
              label="Player name"
              value={name}
              onChange={(event) => { setName(event.target.value); setFormError(''); }}
              error={Boolean(formError)}
              helperText={formError}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button type="submit" color="primary">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UserSelect;
