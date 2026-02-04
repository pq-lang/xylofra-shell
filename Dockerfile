# Use a full-featured Node.js environment on Debian
FROM node:18-bullseye

# Install core Linux tools to support ALL types of commands
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    wget \
    git \
    vim \
    ssh \
    python3 \
    python3-pip \
    build-essential \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install Firebase CLI for global access
RUN npm install -g firebase-tools

# Set the working directory
WORKDIR /home/xylofra

# Custom Prompt: This makes your shell look like "Xylofra@cloud:~$ "
RUN echo 'export PS1="\[\e[32m\]Xylofra\[\e[m\]@cloud:\[\e[34m\]\w\[\e[m\]$ "' >> /root/.bashrc

# Ensure Node-PTY can build correctly
COPY package*.json ./
RUN npm install

# Copy your server bridge code
COPY . .

# Open the port for your website to connect
EXPOSE 8080

# Run the real terminal bridge
CMD ["node", "server.js"]
