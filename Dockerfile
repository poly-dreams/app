FROM golang:latest
WORKDIR app
COPY ./init.sh .
EXPOSE 3000
CMD ["./init.sh"]
