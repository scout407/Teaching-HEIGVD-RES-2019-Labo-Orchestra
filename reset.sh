echo ""
echo ""
echo "*** Killing all running containers"
echo ""
docker kill $(docker ps -a -q)
docker rm $(docker ps -a -q)

#
# Let's get rid of existing images...
#
echo ""
echo ""
echo "*** Deleting our 3 Docker images, if they exist"
echo ""
docker rmi res/auditor
docker rmi res/musician
docker rmi res/validate-music

#
# ... and rebuild them
#
echo ""
echo ""
echo "*** Rebuilding our 3 Docker images"
echo ""
docker build --tag res/musician --file ./docker/image-musician/Dockerfile ./docker/image-musician/
docker build --tag res/auditor --file ./docker/image-auditor/Dockerfile ./docker/image-auditor/