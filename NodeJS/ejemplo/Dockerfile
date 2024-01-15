FROM public.ecr.aws/docker/library/node:21-alpine3.18
#COPY --from=dqk02008.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
#ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so
WORKDIR /app
COPY package*.json  ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "./bin/www"]
