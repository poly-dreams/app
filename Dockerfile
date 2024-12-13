FROM golang:latest
WORKDIR app
COPY ./main.go .
COPY ./init.sh .
CMD ["./init.sh"]
