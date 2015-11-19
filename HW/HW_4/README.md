## Part 1

```bash
cd first && docker build -t first .         # Build the first container
cd ../second && docker build -t second .    # Build the second container
docker run --name first first               # Run the first containre
docker run -t -i --link first:file_io second curl file_io:9001    # Run second container in linked mode to first container to get o/p
```
