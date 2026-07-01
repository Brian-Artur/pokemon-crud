# Runbook de despliegue — App CRUD Pokémon

## 1. VirtualBox  [KUBUNTU]

```bash
sudo apt update
sudo apt install virtualbox         # hypervisor: crea y corre la VM
sudo usermod -aG vboxusers $USER    # permisos; reloguear después
```

> La VM se creó por la GUI: Ubuntu Server 26.04, "Skip Unattended", red = Adaptador puente,
> 2 GB RAM, disco 20-25 GB dinámico, y SSH (OpenSSH) marcado en el instalador.

---

## 2. Clave SSH para GitHub + subir el repo  [KUBUNTU]

```bash
ls -la ~/.ssh                       # ¿ya hay clave?
# genera par de claves (privada/pública)
ssh-keygen -t ed25519 -C "mi-email-github"     
cat ~/.ssh/id_ed25519.pub           # pública -> pegar en GitHub > SSH keys
# registra GitHub como host conocido
ssh-keyscan github.com >> ~/.ssh/known_hosts   
ssh -T git@github.com               # verifica (debe saludar "Hi <usuario>!")
```

```bash
git remote add origin git@github.com:Brian-Artur/pokemon-crud.git  // vincula remoto
git push -u origin main                        // sube; -u empareja main local<->remoto
```

---

## 3. Entrar al servidor  [KUBUNTU]

```bash
# usuario@IP-de-la-VM (la IP la da el panel de bienvenida)
ssh user@192.168.1.200     
```

---

## 4. Puesta al día del sistema  [SERVIDOR]

```bash
sudo apt update                     # refresca el catálogo de paquetes
sudo apt upgrade                    # instala las actualizaciones
sudo reboot                         # si actualizó el kernel; reconectar después
```

---

## 5. Node.js 24  [SERVIDOR]

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -  // añade repo NodeSource
sudo apt install nodejs    // instala Node 24 (los repos base traen versión vieja)
node --version             // verifica v24.x
```

---

## 6. Clonar el proyecto  [SERVIDOR]

```bash
cd ~
git clone https://github.com/Brian-Artur/pokemon-crud.git  // HTTPS: repo público, sin auth
```

---

## 7. Dependencias del backend  [SERVIDOR]

```bash
cd ~/pokemon-crud/pokeapi-lab
npm install                // descarga node_modules (no viaja con el repo)
```

---

## 8. Docker  [SERVIDOR]

```bash
# instala Docker Engine + compose plugin
curl -fsSL https://get.docker.com | sh   
sudo usermod -aG docker $USER       # usar docker sin sudo
exit                                # salir y reconectar para aplicar el grupo
```

```bash
docker --version                    # verifica motor
docker compose version              # verifica plugin compose
```

---

## 9. Base de datos MariaDB (en Docker)  [SERVIDOR]

```bash
cd ~/pokemon-crud/pokeapi-lab
docker compose up -d                # levanta MariaDB en segundo plano (-d)
docker ps                           # confirma contenedor "mariadb-estudio" Up y puerto 3306
```

---

## 10. Crear el `.env` del backend  [SERVIDOR]

```bash
cd ~/pokemon-crud/pokeapi-lab
nano .env                           # crear a mano (no viaja con el repo)
```

Contenido del `.env` (debe coincidir con el docker-compose.yml):

```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=baf
DB_PASSWORD=1234
DB_NAME=proyecto
```

---

## 11. Crear la tabla `pokemons`  [SERVIDOR]

```bash
# abre cliente SQL DENTRO del contenedor
docker exec -it mariadb-estudio mariadb -ubaf -p proyecto  
```

Ya dentro del cliente SQL (`MariaDB [proyecto]>`):

```sql
CREATE TABLE pokemons (
  id INT PRIMARY KEY,          -- sin AUTO_INCREMENT: los ids vienen de la PokeAPI
  name VARCHAR(255) NOT NULL,
  types JSON NOT NULL          -- guarda el array como JSON (parse/stringify en el repo)
);

DESCRIBE pokemons;             -- verifica la estructura
exit                           -- salir del cliente SQL
```

---

## 12. Compilar, poblar y probar el backend  [SERVIDOR]

```bash
cd ~/pokemon-crud/pokeapi-lab
npm run build                       # tsc: compila TS -> JS en dist/ (prod ejecuta JS, no TS)
node dist/ingest.js                 # ingesta: trae 20 pokémon de la PokeAPI a la DB
# verifica (npm start primero si pruebas a mano)
curl http://localhost:3000/api/pokemons    
```

> Prueba manual opcional: `npm start` (corre en primer plano; `Ctrl+C` para parar antes de systemd).

---

## 13. Backend como servicio systemd  [SERVIDOR]

```bash
which node                 // ruta absoluta de node (systemd no hereda tu PATH)
pwd                        // ruta del proyecto (para WorkingDirectory)
sudo nano /etc/systemd/system/pokeapi.service   // crear definición del servicio
```

Contenido de `pokeapi.service`:

```ini
[Unit]
Description=Pokemon API (Express backend)
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=user
WorkingDirectory=/home/user/pokemon-crud/pokeapi-lab
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload        # que systemd descubra el archivo nuevo
sudo systemctl enable pokeapi       # arrancar al boot
sudo systemctl start pokeapi        # arrancar ahora
sudo systemctl status pokeapi       # verifica "active (running)" (q para salir)
```

---

## 14. Frontend — build de producción  [SERVIDOR]

```bash
cd ~/pokemon-crud/poke-front
npm install                         # dependencias del front
npm run build                       # genera dist/ (ficheros estáticos: html, css, js)
ls dist                             # confirma index.html + assets/
```

---

## 15. Nginx — servir front + proxy a /api  [SERVIDOR]

```bash
sudo apt install nginx              # está en los repos base
sudo systemctl status nginx         # arranca solo al instalar
sudo mkdir -p /var/www/poke         # carpeta pública para servir web
# copia el build (no en /home)
sudo cp -r ~/pokemon-crud/poke-front/dist/* /var/www/poke/   
# dueño = usuario de Nginx (permisos)
sudo chown -R www-data:www-data /var/www/poke   
# crear configuración del sitio
sudo nano /etc/nginx/sites-available/poke        
```

Contenido de `/etc/nginx/sites-available/poke`:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/poke;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # SPA: cae en index.html, React enruta
    }

    location /api {
        proxy_pass http://127.0.0.1:3000;   # reenvía /api a Express (sustituye al proxy de Vite)
    }
}
```

```bash
# activa el sitio (symlink)
sudo ln -s /etc/nginx/sites-available/poke /etc/nginx/sites-enabled/  
# desactiva el sitio por defecto (compite por el :80)
sudo rm /etc/nginx/sites-enabled/default      
sudo nginx -t                       # VALIDA sintaxis ANTES de recargar (hábito)
sudo systemctl reload nginx         # aplica sin cortar el servicio
```

> Probar en navegador: `http://192.168.1.200` -> debe cargar la app y funcionar el CRUD.

---

## 16. IP estática con Netplan  [SERVIDOR]

```bash
ip -brief a                         # IP/máscara actual e interfaz (enp0s3)
ip route | grep default             # gateway (router), ej. 192.168.1.1
resolvectl dns                      # DNS actuales
ping -c 3 192.168.1.200             # comprobar que la IP elegida está LIBRE
```

```bash
ls /etc/netplan/                    # localizar el archivo (00-installer-config.yaml)
# backup (red de seguridad)
sudo cp /etc/netplan/00-installer-config.yaml ~/netplan-backup.yaml   
# editar a estático
sudo nano /etc/netplan/00-installer-config.yaml        
```

Contenido del YAML (¡indentación con espacios, no tabs!):

```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: false                  # deja de pedir IP automática (rompe el "baile")
      addresses:
        - 192.168.1.200/24
      routes:
        - to: default
          via: 192.168.1.1          # gateway (router)
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
```

```bash
sudo netplan apply                  # aplica en firme (apply NO pide confirmación)
ip -brief a                         # verifica enp0s3 = 192.168.1.200/24
ping -c 2 8.8.8.8                   # verifica salida a internet
```

> `netplan try` se auto-revierte a los 120 s si no confirmas con Enter (por eso volvía a DHCP).
> Para fijarla de verdad usar `netplan apply`. Probar con `sudo reboot` que sobrevive al reinicio.

---

## Mantenimiento (para la próxima vez)  [SERVIDOR]

```bash
sudo systemctl restart pokeapi      # reiniciar backend tras cambios
sudo systemctl status pokeapi       # estado del backend
journalctl -u pokeapi -f            # logs del backend en vivo
docker ps                           # estado de la DB
docker compose up -d                # relevantar la DB (desde pokeapi-lab/)
# validar + recargar Nginx
sudo nginx -t && sudo systemctl reload nginx  
# errores de Nginx
sudo tail -n 20 /var/log/nginx/error.log      
```

Actualizar el proyecto con cambios nuevos del repo:

```bash
cd ~/pokemon-crud
git pull                                    # traer cambios
# back
cd pokeapi-lab && npm install && npm run build && sudo systemctl restart pokeapi   
# front
cd ../poke-front && npm install && npm run build      
# publicar front
sudo cp -r dist/* /var/www/poke/ && sudo chown -R www-data:www-data /var/www/poke  
```