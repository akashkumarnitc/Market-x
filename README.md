# Market-X

Market-X is a modern, full-stack marketplace web application where users can explore, list, and purchase products with ease and efficiency. It features user authentication, product management, profile settings, and a responsive UI built with React and Tailwind CSS.

---

## Features

- **User Authentication:** Sign up, log in, and log out securely.
- **Profile Management:** Update phone number and profile picture.
- **Product Listings:** Browse, add, and view product details.
- **Cart & Requests:** Add products to cart and manage requests.
- **Responsive Design:** Works well on desktop and mobile devices.
- **Image Uploads:** Upload and preview profile and product images.
- **Protected Routes:** Only authenticated users can access certain pages.

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose)
- **Image Hosting:** Cloudinary
- **Authentication:** JWT, HTTP-only cookies

---

## Folder Structure

```
Market-X/
├── Market-X/
│   ├── client/         # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── api/
│   │   │   └── App.jsx
│   │   └── ...
│   └── server/         # Express backend
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── ...
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/market-x.git
cd market-x/Market-X
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

#### Create a `.env` file in `/server` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

#### Start the backend server

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../client
npm install
```

#### Start the frontend

```bash
npm start
```

---

## Usage

- Visit `http://localhost:3000` in your browser.
- Sign up for a new account or log in.
- Browse products, add new products, update your profile, and manage your cart.

---

## Key Files

- **client/src/App.jsx**: Main React Router setup.
- **client/src/pages/Home.jsx**: Home page with product listing and "Get Started" button.
- **client/src/components/Signin.jsx**: Signup form with image upload and preview.
- **client/src/pages/Profile.jsx**: User profile page for updating phone and profile picture.
- **server/controllers/user.controller.js**: User registration, login, and profile update logic.

---

## API Endpoints

### Auth & User

- `POST /user/register` — Register a new user
- `POST /user/login` — Login
- `POST /user/logout` — Logout
- `GET /user/check` — Get current logged-in user
- `PUT /user/update-profile` — Update phone number and profile picture

### Products

- `GET /product/all` — Get all products
- `GET /product/:id` — Get product details
- `POST /product/add` — Add a new product

---

## Customization

- **Profile Picture Default:** Change `/src/assets/profile1.jpeg` for the default avatar.
- **Requests Badge:** Update logic in Navbar for real request counts.
- **Styling:** Tailwind CSS classes can be customized in each component.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/)