import domain from "./networking/domain";
import {
  kubernetesProvider,
  kubernetesCluster,
  kubeconfig,
} from "./kubernetes/cluster";
// import spaces from "./storage/spaces";
import nginx from "./networking/nginx";
import project from "./project";
import cert from "./networking/cert";
import { deployMongoDBCluster } from "./databases/mongo";

import ingress from "./networking/ingress";
import linkfreeApp from "./apps/linkfree";
import finderApp from "./apps/finder";
import secrets from "./kubernetes/secrets";

const name = "eddiehub2";
const url = "eddiehubcommunity.org";

const domainResource = domain(name, url);

const loadBalancerResource = cert(domainResource);

const nginxResource = nginx(kubernetesProvider, loadBalancerResource);
// const spacesResource = spaces(name, url);

deployMongoDBCluster("mongo", kubernetesProvider);
secrets(kubernetesProvider);

ingress(kubernetesProvider);
linkfreeApp(kubernetesProvider);
finderApp(kubernetesProvider);

project(name, [
  loadBalancerResource.loadBalancerUrn,
  domainResource.domainUrn,
  kubernetesCluster.clusterUrn,
  // spacesResource,
]);

export { kubeconfig };
