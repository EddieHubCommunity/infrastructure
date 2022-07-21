import * as kubernetes from "@pulumi/kubernetes";

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

import linkfreeConfig from "./apps/linkfree";

const name = "eddiehub2";
const url = "eddiehubcommunity.org";

const domainResource = domain(name, url);

const loadBalancerResource = cert(domainResource);

const nginxResource = nginx(kubernetesProvider, loadBalancerResource);
// const spacesResource = spaces(name, url);

import { deployMongoDBCluster } from "./databases/mongo";

deployMongoDBCluster("mongo", kubernetesProvider);

const nginxIngress = new kubernetes.networking.v1.Ingress(
  "nginx",
  {
    metadata: {
      annotations: {
        "pulumi.com/skipAwait": "true",
      },
    },
    spec: {
      rules: [
        {
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: "nginx-044168c8", // @TODO: get this from the service
                    port: {
                      number: 80,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    provider: kubernetesProvider,
  }
);

linkfreeConfig(kubernetesProvider);

project(name, [
  loadBalancerResource.loadBalancerUrn,
  domainResource.domainUrn,
  kubernetesCluster.clusterUrn,
  // spacesResource,
]);

export { kubeconfig };
