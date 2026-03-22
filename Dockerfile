# Use official Node image, includes npm and node
FROM node:22

# Install dependencies for Python3 and ffmpeg
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# Copy all files
WORKDIR /app
COPY . .

# Install Node deps
RUN npm install

# Expose port
EXPOSE 8080

# Start the server
CMD [ "node", "index.js" ]
