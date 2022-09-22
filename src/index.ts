import { firewall, firewallName } from "./kubernetes/firewall";

import * as civo from "@pulumi/civo";
import * as kubernetes from "@pulumi/kubernetes";
// import domain from "./networking/domain";
import {
  createCluster,
  // createCluster,
  // kubeconfig,
} from "./kubernetes/cluster";
// import spaces from "./storage/spaces";
import nginx from "./networking/nginx";
// import cert from "./networking/cert";
import { deployMongoDBCluster } from "./databases/mongo";

// import ingress from "./networking/ingress";
// import secrets from "./kubernetes/secrets";
import linkfreeApp from "./apps/linkfree";
// import finderApp from "./apps/finder";
// import apiApp from "./apps/api/deployment";

const name = "eddiehub2";
const url = "eddiehubcommunity.org";

const firewallResource = firewall(name);
const clusterResource = createCluster(firewallResource.id);

export const kubeconfig = clusterResource.kubeconfig;

const kubernetesProvider = new kubernetes.Provider("civo", {
  kubeconfig: clusterResource.kubeconfig,
});

// const domainResource = domain(name, url);
// const secretsResource = secrets(kubernetesProvider);

// const loadBalancerResource = cert(domainResource);

const nginxResource = nginx(kubernetesProvider);
// const spacesResource = spaces(name, url);

const mongoDb = deployMongoDBCluster("mongo", kubernetesProvider);

// ingress(kubernetesProvider);
// finderApp(kubernetesProvider, secretsResource);
// apiApp(kubernetesProvider, []);
linkfreeApp(kubernetesProvider);

import { deployGrafana } from "./monitoring/grafana";
const grafana = deployGrafana("production", kubernetesProvider);

import { deployLoki } from "./monitoring/loki";
const loki = deployLoki("production", kubernetesProvider);

import { deployPromTail } from "./monitoring/promtail";
const promtail = deployPromTail("production", kubernetesProvider);

import { deployTeleport } from "./teleport";
const teleport = deployTeleport("production", kubernetesProvider);

// export { kubeconfig };
