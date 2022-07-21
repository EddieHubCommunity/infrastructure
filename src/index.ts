import domain from "./networking/domain";
import { kubernetesProvider } from "./kubernetes/cluster";
import spaces from "./storage/spaces";
import nginx from "./networking/nginx";
import project from "./project";
import volume from "./storage/volume";
import cert from "./networking/cert";

const name = "eddiehub2";
const url = "eddiehubcommunity.io";

const domainResource = domain(name, url);
const nginxResource = nginx(kubernetesProvider);
const spacesResource = spaces(name, url);
const volumeResource = volume(kubernetesProvider);
const certResource = cert(kubernetesProvider);

project(name, [
  domainResource.urn,
  kubernetesProvider.urn,
  nginxResource.urn,
  spacesResource.urn,
  volumeResource.urn,
  certResource.urn,
]);
