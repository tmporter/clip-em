# clip-em

Clip 'em, Dum!

# 📃 TODO

- update "deal to all" business logic to always deal starting with the player to the left of the dealer
- validation before adding events
  - player bet size
- various TODOs
- implement passing cards
- implement burning cards
- add winning hand indicator?
- if storing all of gamestate in a single file is a performance issue, consider using snapshots and/or storing partial history to a certain threshold.
- add call button: match the highest current bet at the table
- add all-in button
- implement showing opponent hands

# 🐛 BUGS

- [client] phantom cards appearing for some reason
- [client] pointer cursor not working
- [client] button hover states not working properly

# 📌 DOING

- figure out how to host this monstrocity

# ✅ DONE

- find a more efficient way to structure `GameState.apply()`
- [BUG] If a winner is marked, the pot is 0, and the "Next Hand" button is clicked, the winner's cash is set to null.
- persist game state event stream to disk
- implement folding. make player transparent
- typescript-ify the server-side game objects (PlayerManager, Deck, Card, etc.)
