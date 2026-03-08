# VALOBASE - Ultimate Valorant Database

A stunning, modern web application for exploring all Valorant game data including agents, weapons, maps, and cosmetics. Built with Next.js 15, React Three Fiber for 3D elements, and Framer Motion for smooth animations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js)

## Features

### Agents
- Browse all playable agents with role-based filtering
- Search functionality for quick access
- Detailed agent pages with:
  - Full ability breakdowns with icons
  - Interactive ability tabs
  - Voice line audio playback
  - Agent background lore
  - Role descriptions

### Weapons
- Complete arsenal organized by category (Sidearms, SMGs, Rifles, Shotguns, Machine Guns, Snipers, Melee)
- Detailed weapon statistics:
  - Fire rate, magazine size, reload time
  - Wall penetration ratings
  - Damage falloff tables by range
- Full skin browser with chroma/variant selection

### Maps
- All competitive and rotating maps
- High-resolution splash images
- Tactical callout lists organized by region (A Site, B Site, Mid)
- Interactive minimaps
- Map coordinates and descriptions

### Arsenal (Cosmetics)
- Gun Buddies collection
- Player Cards gallery
- Sprays catalog
- Game Modes information

### Design & UX
- Dark gaming aesthetic with Valorant's signature red accent
- 3D animated hero sections using React Three Fiber
- Smooth scroll-triggered animations with Framer Motion
- Responsive design for all screen sizes
- Loading skeletons for better perceived performance
- Scroll-to-top navigation button

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **3D Graphics:** React Three Fiber + Drei
- **Animations:** Framer Motion + CSS Keyframes
- **API:** [Valorant-API](https://valorant-api.com/)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/valobase.git
cd valobase

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout with navbar/footer
│   ├── loading.tsx           # Global loading state
│   ├── agents/
│   │   ├── page.tsx          # Agents list
│   │   └── [uuid]/page.tsx   # Agent detail
│   ├── weapons/
│   │   ├── page.tsx          # Weapons list
│   │   └── [uuid]/page.tsx   # Weapon detail
│   ├── maps/
│   │   ├── page.tsx          # Maps list
│   │   └── [uuid]/page.tsx   # Map detail
│   └── arsenal/
│       └── page.tsx          # Buddies, Cards, Sprays, Modes
├── components/
│   ├── home/                 # Homepage sections
│   ├── agents/               # Agent components
│   ├── weapons/              # Weapon components
│   ├── maps/                 # Map components
│   ├── arsenal/              # Arsenal components
│   ├── three/                # 3D scene components
│   ├── ui/                   # shadcn/ui + custom components
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── scroll-to-top.tsx
├── lib/
│   └── valorant-api.ts       # API client with caching
└── hooks/
    └── use-animations.ts     # Animation utilities
```

## API Reference

This project uses the free [Valorant-API](https://valorant-api.com/v1) which provides:

| Endpoint | Description |
|----------|-------------|
| `/agents` | All playable agents with abilities |
| `/weapons` | Weapons with stats and skins |
| `/maps` | Maps with callouts and images |
| `/buddies` | Gun buddy cosmetics |
| `/playercards` | Player card cosmetics |
| `/sprays` | Spray cosmetics |
| `/gamemodes` | Game mode information |

## Performance Optimizations

- **In-memory caching** for API responses (5-minute TTL)
- **ISR caching** for smaller endpoints (1-hour revalidation)
- **Dynamic imports** for 3D scenes (SSR disabled)
- **Image optimization** with Next.js Image component
- **Loading skeletons** for better perceived performance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

VALOBASE is a fan-made project and is not affiliated with or endorsed by Riot Games. Valorant and all related properties are trademarks of Riot Games, Inc.

## Acknowledgments

- [Valorant-API](https://valorant-api.com/) for providing the free API
- [Riot Games](https://www.riotgames.com/) for creating Valorant
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for 3D capabilities

---

**Made with passion for the Valorant community**
