# Use Nginx as the base image
FROM nginx:latest

# Remove the default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app to the Nginx folder
COPY dist/cdmp-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
