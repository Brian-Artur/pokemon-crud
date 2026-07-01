SERVICIO                RUTA / CONTENIDO              DEFINIDO / COMPILADO CON
                (qué lo gestiona)       (dónde vive en disco)        (qué lo generó)
              ─────────────────────   ──────────────────────────   ──────────────────────────
FRONTEND        (sin servicio propio;   /var/www/poke                vite build  (npm run build)
(React)          lo sirve Nginx)        build estático (html/js)     → dist/ → copiado aquí

BACKEND         pokeapi.service         ~/pokemon-crud/pokeapi-lab/   tsc  (npm run build)
(Express)       (systemd)               ├─ dist/index.js  (ejecuta)  ejecutado por /usr/bin/node
                                        └─ .env           (config)

MARIADB         docker.service          volumen  mariadb_data        docker compose
                → contenedor            (datos persistentes)         (imagen mariadb:lts)
                  mariadb-estudio        compose en pokeapi-lab/

NGINX           nginx.service           /etc/nginx/                  apt install nginx
                (systemd)               sites-available/poke         (config escrita a mano)
                                        (enlazado en sites-enabled)

IP ESTÁTICA     systemd-networkd        /etc/netplan/                netplan apply
(Netplan)       (aplica la config)      00-installer-config.yaml     (YAML escrito a mano)