<div id="top"></div>
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/albertogeniola/container-nettool">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Container Net-Tool</h3>

  <p align="center">
    ·
    <a href="https://github.com/albertogeniola/container-nettool/issues">Report Bug</a>
    ·
    <a href="https://github.com/albertogeniola/container-nettool/issues">Request Feature</a>
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## About The Project

This is no more than a containerized web-server (using Python Flask) that runs a bouch of simple tools to 
debug things, especially when dealing with containerized environments. 

You might be thinking: yeah, we don't need that, as we can easily attach to a running container, spawn a 
shell and do our stuff from there. That is indeed correct, __but__ that gets harder when dealing with 
serverless technologies as Google's CloudRun or AppEngine flexible.

<br/><p><span style="color: red; font-weight:bold">Careful!</span> This tool is not intended for production use.
This is a debugging container which HAS TO BE PROTECTED by some security layer (e.g. Google's IAP)
so that <b>only allowed users can access it</b>. Failure to do so would potentially leave a "backdoor" opened
for any system this container could reach, configuring it as a perfect vector to attack other workloads.</p>

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Angular 11 + Typescript](https://nextjs.org/)
* [Flask + Python 3.10](https://reactjs.org/)
* [Docker](https://angular.io/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
This repo contains all you need to build your version of the Container Net-Tool. 
You just need to clone the repo, build the image and deploy it wherever needed.

To test it locally, first build the image.

  ```sh
  git clone https://github.com/albertogeniola/container-nettool.git
  cd container-nettool
  docker build -t net-tool:$(cat VERSION) .
  ```

Then start it.

  ```sh
  docker run net-tool:$(cat VERSION)
  ```

In case you want to start the container on a specific port (useful for Google CloudRun), set it as and env var.

  ```sh
  CONTAINER_PORT=9090
  docker run -p 0.0.0.0:5000:$CONTAINER_PORT/tcp -e PORT=$CONTAINER_PORT net-tool:$(cat VERSION)
  ```

Note: you must both expose the container port and tell the container which port it has to bind via the 
PORT env var. This ensures best compatibility with Google CloudRun as it assumes the container port
can be changed at any time.


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/albertogeniola/container-nettool](https://github.com/albertogeniola/container-nettool)

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/albertogeniola/container-nettool.svg?style=for-the-badge
[contributors-url]: https://github.com/albertogeniola/container-nettool/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/albertogeniola/container-nettool.svg?style=for-the-badge
[forks-url]: https://github.com/albertogeniola/container-nettool/network/members
[stars-shield]: https://img.shields.io/github/stars/albertogeniola/container-nettool.svg?style=for-the-badge
[stars-url]: https://github.com/albertogeniola/container-nettool/stargazers
[issues-shield]: https://img.shields.io/github/issues/albertogeniola/container-nettool.svg?style=for-the-badge
[issues-url]: https://github.com/albertogeniola/container-nettool/issues
[license-shield]: https://img.shields.io/github/license/albertogeniola/container-nettool.svg?style=for-the-badge
[license-url]: https://github.com/albertogeniola/container-nettool/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/albertogeniola