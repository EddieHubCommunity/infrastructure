import domain from "./networking/domain";
import { kubernetesProvider } from "./kubernetes/cluster";
import spaces from "./storage/spaces";
import nginx from "./networking/nginx";
import project from "./project";

const name = "eddiehub2";
const url = "eddiehub.io";

const domainResource = domain(name, url);
const nginxResource = nginx(kubernetesProvider);
const spacesResource = spaces(name, url);

project(name, [
  domainResource.urn,
  kubernetesProvider.urn,
  nginxResource.urn,
  spacesResource.urn,
]);
