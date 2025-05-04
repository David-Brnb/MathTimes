# MathTimes

**MathTimes** is an open‑source educational platform that combines a Unity‑based 3‑level video game with a React dashboard and a Python (FastAPI) backend.  
Its goal is to reinforce key fourth‑grade mathematics topics—basic operations, geometry and measurements—while allowing teachers to monitor each pupil’s progress in real time.

---

## Features

- **Immersive game**  
  - Three themed worlds (prehistoric, medieval, futuristic) with mini‑games that assess addition–subtraction, multiplication, division, areas, volumes and unit conversion.  
  - Automatic saving of progress, error rate, cosmetics earned and resume‑later capability.

- **Teacher dashboard**  
  - Top‑5 performers (overall and by gender), lowest scores and average progress.  
  - Doughnut and radar charts showing successes vs. errors and level completion percentages.  
  - Admin vs. teacher roles with scoped data access.

- **API** (excerpt)  
  | Route | Method | Purpose |  
  |-------|--------|---------|  
  | `/api/verif/alumno` | POST | Validate student login |  
  | `/api/ejercicio_random/{title}` | GET | Retrieve a random exercise |  

- **Fully containerised**: one‑command deployment via Docker Compose.

---

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Game         | Unity 2021 LTS |
| Backend      | Python 3.11 · FastAPI |
| Dashboard    | React 18 · Vite · Tailwind CSS |
| Database     | SQLite (volume‑mounted) |
| DevOps       | Docker 20.10+ · Docker Compose |

---

## Prerequisites

- **Docker 20.10** or higher  
- **Ports** 3000 (frontend) and 8000 (backend) open  
- At least **1.5 GB** free disk space  
- Windows 64‑bit or macOS (Gatekeeper instructions below)

---

## Getting Started

```bash
# 1 · clone / create a workspace
mkdir team6-app && cd team6-app

# 2 · create the compose file
cat > docker-compose.yml <<'EOF'
services:
  backend:
    image: dafget/team6-web-backend
    ports: ["8000:8000"]
    volumes:
      - game-volume:/BackEnd/db
    networks: [app-network]

  frontend:
    image: dafget/team6-web-frontend
    ports: ["3000:3000"]
    depends_on: [backend]
    networks: [app-network]

networks:
  app-network:
    driver: bridge

volumes:
  game-volume:
EOF

# 3 · launch
docker compose up
```

When both containers are healthy you will see something like:

frontend-1 | ➜  Local:   http://localhost:3000/

Open that URL in your browser.

### Running the game executable

1. Click the **Download Game** link on the dashboard.
2. **Windows / Linux**: double‑click the file and allow any permission prompt.
3. **macOS**: if Gatekeeper blocks the app, go to **System Settings → Privacy & Security** and press **Open Anyway** for *MathTimes*.

---

## Project Structure
```
/
├─ game/           # Unity project (exported build in release)
├─ backend/        # FastAPI source (served via Uvicorn)
├─ frontend/       # React dashboard
└─ docker-compose.yml
```
---

## Contributing

Pull requests are welcome. Please open an issue first to discuss major changes and follow the coding standards described in the **CONTRIBUTING.md** (IEEE 1016 style & 80 % doc coverage).

---

## License

This project is distributed under the **Creative Commons Attribution‑NonCommercial‑ShareAlike 4.0 International (CC BY‑NC‑SA 4.0)** license.
Commercial use requires prior written permission from **Team Impala**.

---

## Authors

* David Leónidas Bernabé Torres – A00839254
* Ana Keila Martínez Moreno – A01666624
* Iker Mejía Hernández – A01352358
* Alan Enrique Riou González – A01664842

Feel free to reach out via the e‑mails listed in the project documentation.

---

## Acknowledgements

* UNICEF, Government of Mexico and NIH reports on children’s use of videogames and learning.
* Icon and sound assets credited in the [external resources document](link‑to‑Google Doc).
