# Battleship

A classic Battleship game built with vanilla JavaScript. Play against the computer, deploy your fleet, then take turns firing at each other's boards until one fleet is completely sunk.

## Features

- Interactive ship placement with horizontal/vertical rotation (Shift to toggle)
- 10×10 game boards for both player and computer
- Randomized computer ship placement and attacks
- Visual hit/miss feedback on both boards
- Win/loss detection with option to start a new battle
- Five ships to deploy: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), and Destroyer (2)

## Challenges

- Breaking the project down into smaller, manageable problems was tough. I often struggled to visualize how individual pieces would fit together as a whole.
- The hover effect for ship placement took more work than expected to get right.
- Styling the bot's automated attacks required handling edge cases I didn't anticipate.
- The GameController ended up carrying too much responsibility. Its design pattern is something I'd like to improve in future projects.

## What I Learned

- Got hands-on experience writing tests with Jest in a real project.
- Improved at separating tasks and working incrementally, though there's still room to grow.
- Picked up new DOM manipulation techniques, like using `outline` instead of `border` for cell styling since it doesn't affect layout.
- Gained a better understanding of how to connect game logic to a UI and manage state between the two.