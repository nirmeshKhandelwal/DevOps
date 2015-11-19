FROM ubuntu:trusty
MAINTAINER Nirmesh Khandelwal <nbkhande@ncsu.edu>
RUN apt-get update && apt-get install -y socat
RUN echo "Some text that goes into file" > abc.txt

CMD socat SYSTEM:'cat abc.txt' TCP4-LISTEN:9001
