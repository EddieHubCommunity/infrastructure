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
import secrets from "./kubernetes/secrets";
import finderApp from "./apps/finder";
import apiApp from "./apps/api";

const name = "eddiehub2";
const url = "eddiehubcommunity.org";

const domainResource = domain(name, url);
const secretsResource = secrets(kubernetesProvider);

const loadBalancerResource = cert(domainResource);

const nginxResource = nginx(kubernetesProvider, loadBalancerResource);
// const spacesResource = spaces(name, url);

const mongoResource = deployMongoDBCluster(
  "mongo",
  kubernetesProvider,
  secretsResource
);

ingress(kubernetesProvider);
linkfreeApp(kubernetesProvider);
finderApp(kubernetesProvider, secretsResource);
apiApp(kubernetesProvider, secretsResource, [mongoResource]);

project(name, [
  loadBalancerResource.loadBalancerUrn,
  domainResource.domainUrn,
  kubernetesCluster.clusterUrn,
  // spacesResource,
]);

export { kubeconfig };
