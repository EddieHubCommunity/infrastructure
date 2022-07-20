import domain from "./networking/domain";
import { kubernetesProvider } from "./kubernetes/cluster";
import spaces from "./storage/spaces";
import nginx from "./networking/nginx";
import project from "./project";
import volume from "./storage/volume";

const name = "eddiehub2";
const url = "eddiehub.io";

project(name);
// domain(name, url);
nginx(kubernetesProvider);
spaces(name, url);
volume(name, kubernetesProvider.id);
