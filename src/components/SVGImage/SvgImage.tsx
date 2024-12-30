import React from 'react';

interface SvgPaths {
    bath: string,
    heat: string,
    fire: string,
    eco: string,
    antifreeze: string,
    fan: string,
    waterPump: string,
    waterFlow: string,
    waterPress: string,
    power: string,
    snow: string,
    sun: string,
    clock: string,
    history: string
}

export const paths: SvgPaths = {
    bath: `M109.909333 1024a36.565333 36.565333 0 0 1-36.010666-29.952l-0.554667-6.570667V274.474667a274.304 274.304 0 0 1 533.077333-90.752 325.632 325.632 0 0 1 216.917334 102.4 336.384 336.384 0 0 1 90.965333 225.408 36.565333 36.565333 0 0 1-29.994667 36.565333l-6.570666 0.597333H292.693333a36.565333 36.565333 0 0 1-36.522666-36.565333A328.277333 328.277333 0 0 1 529.066667 187.818667 201.088 201.088 0 0 0 146.773333 262.272l-0.341333 12.202667v712.96a36.565333 36.565333 0 0 1-36.565333 36.608zM563.882667 257.28a256.384 256.384 0 0 0-229.546667 204.757333l-2.432 13.866667h506.112a255.914667 255.914667 0 0 0-252.8-219.648l11.989333 0.426667a36.565333 36.565333 0 0 1-33.322666 0.597333z m240.725333 620.544a36.565333 36.565333 0 0 1-36.565333-36.565333v-219.392a36.565333 36.565333 0 1 1 73.130666 0v219.392a36.565333 36.565333 0 0 1-36.565333 36.565333z m-219.392 0a36.608 36.608 0 0 1-35.968-29.994667l-0.597333-6.570666v-219.392a36.565333 36.565333 0 0 1 72.533333-6.485334l0.597333 6.485334v219.392a36.565333 36.565333 0 0 1-36.565333 36.565333z m-219.392 0a36.608 36.608 0 0 1-35.882667-29.994667l-0.682666-6.570666v-219.392a36.565333 36.565333 0 0 1 72.533333-6.485334l0.597333 6.485334v219.392a36.565333 36.565333 0 0 1-36.565333 36.565333z`,
    heat: `M654.222 227.556a113.778 113.778 0 1 1 227.556 0H896a71.111 71.111 0 1 1 0 142.222h-14.222v455.11a113.778 113.778 0 1 1-227.556 0v-455.11h-28.444v455.11a113.778 113.778 0 1 1-227.556 0v-455.11h-28.444v455.11a113.778 113.778 0 1 1-227.556 0v-455.11H128a71.111 71.111 0 1 1 0-142.222h14.222a113.778 113.778 0 1 1 227.556 0h28.444a113.778 113.778 0 1 1 227.556 0h28.444z m0 56.888h-28.444v28.445h28.444v-28.445z m227.556 0v28.445H896a14.222 14.222 0 1 0 0-28.445h-14.222z m-483.556 0h-28.444v28.445h28.444v-28.445z m-256 0H128a14.222 14.222 0 1 0 0 28.445h14.222v-28.445zM256 170.667a56.889 56.889 0 0 0-56.889 56.889v597.333a56.889 56.889 0 1 0 113.778 0V227.556A56.889 56.889 0 0 0 256 170.666z m256 0a56.889 56.889 0 0 0-56.889 56.889v597.333a56.889 56.889 0 1 0 113.778 0V227.556A56.889 56.889 0 0 0 512 170.666z m256 0a56.889 56.889 0 0 0-56.889 56.889v597.333a56.889 56.889 0 1 0 113.778 0V227.556A56.889 56.889 0 0 0 768 170.666z`,
    fire: `M511.8194 43.705115c0 0-631.015168 705.783422-54.541093 927.198589 220.692769 84.881834 343.13933-116.306173 382.510053-272.705467C895.77425 474.615873 504.956614 346.390123 511.8194 43.705115zM684.833862 825.701587c-19.504762 78.019048-80.908642 178.793651-191.074427 136.172134-288.237037-110.526984 27.451146-463.418695 27.451146-463.418695C517.23739 649.797531 713.007407 714.091005 684.833862 825.701587z`,
    eco: `M269.677714 889.636571A449.097143 449.097143 0 0 0 512 960c86.893714 0 170.020571-24.466286 241.481143-69.851429a27.428571 27.428571 0 1 1 29.403428 46.299429A503.698286 503.698286 0 0 1 512 1014.857143a503.954286 503.954286 0 0 1-271.835429-78.994286 27.428571 27.428571 0 0 1 29.513143-46.226286zM914.285714 694.857143a73.142857 73.142857 0 1 1 0 146.285714 73.142857 73.142857 0 0 1 0-146.285714zM109.714286 694.857143a73.142857 73.142857 0 1 1 0 146.285714 73.142857 73.142857 0 0 1 0-146.285714z m600.32-278.162286c42.532571 0 77.275429 34.742857 77.275428 77.238857v68.352c0 42.532571-34.742857 77.238857-77.275428 77.238857h-14.336a77.421714 77.421714 0 0 1-77.238857-77.238857v-68.352c0-42.496 34.706286-77.238857 77.238857-77.238857h14.336z m-190.171429 0c39.936 0 75.702857 25.892571 75.702857 64.109714a18.285714 18.285714 0 0 1-36.571428 0c0-14.994286-17.334857-27.538286-39.131429-27.538285h-14.372571c-22.308571 0-40.704 18.358857-40.704 40.667428v68.388572c0 22.308571 18.358857 40.630857 40.704 40.630857h14.336c20.114286 0 38.582857-13.165714 38.582857-25.161143a18.285714 18.285714 0 1 1 36.571428 0c0 35.401143-36.973714 61.732571-75.154285 61.732571h-14.336a77.421714 77.421714 0 0 1-77.275429-77.238857v-68.352c0-42.496 34.742857-77.238857 77.275429-77.238857h14.336z m-132.754286 1.901714a18.285714 18.285714 0 0 1 0 36.571429H308.297143v53.686857l78.811428 0.036572a18.285714 18.285714 0 1 1 0 36.571428H308.297143v53.76h78.811428a18.285714 18.285714 0 1 1 0 36.571429H290.011429a18.285714 18.285714 0 0 1-18.285715-18.285715v-180.662857a18.285714 18.285714 0 0 1 18.285715-18.285714h97.097142z m335.506286-354.011428c176.64 80.786286 292.242286 256.109714 292.242286 452.315428 0 22.674286-1.609143 45.385143-4.754286 68.169143a27.428571 27.428571 0 1 1-54.308571-7.460571c2.779429-20.333714 4.205714-40.594286 4.205714-60.708572 0-174.445714-102.838857-330.459429-260.205714-402.432a27.428571 27.428571 0 0 1 22.820571-49.883428z m-384.877714 13.531428a27.428571 27.428571 0 0 1-13.531429 36.352C166.838857 186.441143 64 342.418286 64 516.900571c0 20.041143 1.389714 40.155429 4.132571 60.269715a27.428571 27.428571 0 0 1-54.345142 7.387428 501.248 501.248 0 0 1-4.644572-67.657143c0-196.205714 115.565714-371.565714 292.205714-452.315428a27.428571 27.428571 0 0 1 36.388572 13.531428z m372.297143 375.149715h-14.336c-22.308571 0-40.667429 18.358857-40.667429 40.667428v68.352c0 22.308571 18.322286 40.667429 40.667429 40.667429h14.336c22.308571 0 40.704-18.322286 40.704-40.667429v-68.352c0-22.308571-18.358857-40.667429-40.704-40.667428zM512 0a73.142857 73.142857 0 1 1 0 146.285714 73.142857 73.142857 0 0 1 0-146.285714z`,
    antifreeze: `M689.054485 407.880641c-3.89982-6.755868-12.538571-9.072633-19.295462-5.17179l-40.671304 23.479761v-40.627303a8.477069 8.477069 0 0 0-8.475022-8.478091 8.477069 8.477069 0 0 0-8.475022 8.478091v50.415227L526.019295 485.694891v-99.437733l43.662429-25.207102a8.472975 8.472975 0 0 0 3.101641-11.577686 8.475022 8.475022 0 0 0-11.577686-3.101641L526.018272 366.68438v-46.960545c0-7.800663-6.321986-14.126742-14.124696-14.126742-7.801686 0-14.127765 6.325056-14.127765 14.126742V366.68438l-35.187407-20.313651a8.475022 8.475022 0 0 0-11.577686 3.101641 8.475022 8.475022 0 0 0 3.101641 11.577686l43.661405 25.208125v99.437733l-86.114286-49.717331v-50.415227c0-4.681626-3.797489-8.478092-8.475022-8.478092a8.480138 8.480138 0 0 0-8.478092 8.478092v40.627303l-40.671305-23.479761c-6.755868-3.901867-15.396665-1.587148-19.295462 5.16872-3.89982 6.755868-1.584078 15.396665 5.17179 19.297508l40.671305 23.479761-35.187407 20.314674c-4.052293 2.342348-5.442966 7.52437-3.101641 11.577687a8.467859 8.467859 0 0 0 11.576663 3.104711l43.661405-25.210172 86.114287 49.720402-86.114287 49.717331-43.661405-25.207101a8.476045 8.476045 0 0 0-8.476046 14.679327l35.187407 20.313652-40.671304 23.48283c-6.755868 3.89982-9.071609 12.538571-5.17179 19.295462 2.616594 4.532223 7.365758 7.065929 12.248975 7.065929 2.39556 0 4.823865-0.611937 7.05058-1.89721l40.671305-23.47976v40.630372a8.475022 8.475022 0 1 0 16.950044 0v-50.418296l86.114286-49.717332v99.437733l-43.661405 25.207102c-4.052293 2.339278-5.439896 7.523347-3.101641 11.577686a8.477069 8.477069 0 0 0 11.579732 3.101641l35.184337-20.313651v46.963615c0 7.801686 6.325056 14.124695 14.127766 14.124695 7.801686 0 14.126742-6.321986 14.126742-14.124695V653.639904l35.186384 20.313651a8.473999 8.473999 0 0 0 11.577686-3.101641c2.339278-4.052293 0.951675-9.238408-3.101641-11.577686l-43.661406-25.208125v-99.438756l86.114287 49.717331v50.418297a8.475022 8.475022 0 1 0 16.950044 0v-40.630373l40.671304 23.479761a14.060227 14.060227 0 0 0 7.05058 1.89721c4.883217 0 9.632381-2.535753 12.248975-7.06593 3.89982-6.755868 1.584078-15.396665-5.171789-19.295461l-40.671305-23.482831 35.186384-20.313651a8.476045 8.476045 0 0 0 3.101641-11.577687c-2.339278-4.055362-7.52437-5.447059-11.577687-3.101641l-43.661405 25.207102-86.114287-49.717332 86.114287-49.720402 43.661405 25.207102a8.472975 8.472975 0 0 0 11.577687-3.101641c2.339278-4.052293 0.951675-9.238408-3.101641-11.577686l-35.186384-20.314675 40.671305-23.482831c6.757914-3.897773 9.072633-12.535501 5.170766-19.291368z`,
    fan: `M597.924571 1020.361143a209.92 209.92 0 0 1-49.974857-8.374857c-39.789714-16.457143-68.059429-57.124571-84.004571-120.777143a702.610286 702.610286 0 0 1-14.518857-192.859429l0.384-10.112-6.765715 7.533715a295.259429 295.259429 0 0 1-148.498285 94.610285l-0.402286 0.091429-0.365714 0.201143a127.232 127.232 0 0 1-62.171429 12.379428 231.424 231.424 0 0 1-180.425143-83.858285l-0.109714-0.164572a167.588571 167.588571 0 0 1-37.686857-170.806857c14.811429-35.931429 49.371429-62.555429 102.582857-79.122286a579.821714 579.821714 0 0 1 168.228571-20.516571c10.697143 0 22.198857 0.182857 34.194286 0.548571l9.984 0.329143-7.442286-6.710857a294.985143 294.985143 0 0 1-94.281142-148.260571 239.872 239.872 0 0 1 71.314285-243.474286A174.372571 174.372571 0 0 1 415.414857 3.657143a148.224 148.224 0 0 1 53.376 9.691428c39.972571 16.457143 68.333714 57.234286 84.297143 121.161143a703.506286 703.506286 0 0 1 14.427429 193.206857l-0.384 10.368 6.820571-7.826285a297.892571 297.892571 0 0 1 152.704-99.419429 270.244571 270.244571 0 0 1 60.726857-7.076571 241.152 241.152 0 0 1 182.747429 82.56l0.091428 0.091428a167.789714 167.789714 0 0 1 37.686857 170.825143c-35.273143 79.122286-168.228571 95.744-273.554285 95.744-12.8 0-26.386286-0.256-40.228572-0.749714l-10.258285-0.365714 7.716571 6.784a297.526857 297.526857 0 0 1 98.742857 152.192 243.931429 243.931429 0 0 1-75.52 243.547428 178.761143 178.761143 0 0 1-116.882286 45.970286z m-58.313142-453.485714l-0.694858 5.065142a1058.742857 1058.742857 0 0 0-8.009142 244.260572c5.156571 47.817143 17.737143 107.739429 48.457142 121.709714l0.365715 0.146286a66.413714 66.413714 0 0 0 21.046857 3.382857 107.446857 107.446857 0 0 0 67.657143-29.641143 164.571429 164.571429 0 0 0 45.220571-66.486857 155.282286 155.282286 0 0 0 2.742857-99.145143 224.018286 224.018286 0 0 0-71.917714-109.878857 460.8 460.8 0 0 0-100.388571-67.126857l-4.571429-2.285714z m-256.950858-36.571429a613.632 613.632 0 0 0-133.979428 12.342857c-36.571429 8.576-58.642286 20.973714-65.408 36.845714-9.526857 23.771429 1.005714 59.538286 26.203428 88.96a162.962286 162.962286 0 0 0 119.753143 54.729143 163.291429 163.291429 0 0 0 45.878857-6.747428c81.28-21.412571 146.157714-106.258286 177.005715-172.397715l2.249143-4.809142-18.011429-1.28c-54.436571-3.858286-105.837714-7.643429-153.691429-7.643429z m505.014858-232.411429a162.944 162.944 0 0 0-45.842286 6.747429 224.237714 224.237714 0 0 0-109.842286 71.917714 461.147429 461.147429 0 0 0-67.126857 100.406857l-2.285714 4.553143 5.046857 0.694857a1224.411429 1224.411429 0 0 0 164.352 11.904 583.606857 583.606857 0 0 0 134.729143-13.165714c36.681143-9.142857 59.190857-22.326857 66.889143-39.204571l0.128-0.347429c9.014857-26.953143-0.329143-58.514286-26.294858-88.777143a162.870857 162.870857 0 0 0-119.753142-54.656zM418.980571 82.962286a92.178286 92.178286 0 0 0-66.322285 30.72 148.352 148.352 0 0 0-47.323429 64.274285 163.163429 163.163429 0 0 0-4.937143 96.914286v0.091429c21.376 81.243429 106.24 146.176 172.416 177.078857l4.498286 2.084571 0.676571-4.918857a1058.742857 1058.742857 0 0 0 7.990858-244.278857c-5.138286-47.798857-17.700571-107.721143-48.457143-121.709714l-0.713143-0.310857z`,
    waterPump: `M672.768 512c0-33.792 27.136-60.928 60.928-60.928 33.792 0 60.928 27.136 60.928 60.928 0 33.792-27.136 60.928-60.928 60.928-33.28 0-60.928-27.136-60.928-60.928z m274.944-238.08l-119.808 122.368c-21.504-17.92-48.128-29.184-75.776-32.768V182.784c-206.848 0-256 115.2-256 115.2l120.32 117.248c-18.944 23.04-31.232 51.2-34.304 80.896H404.992c0 206.848 115.2 256.512 115.2 256.512l117.76-120.832c23.04 18.432 50.688 29.184 80.384 32.256v177.152c206.848 0 256-115.2 256-115.2l-122.88-119.808c16.896-22.016 27.648-48.128 30.72-75.264h180.736c0-207.36-114.688-257.024-115.2-257.024z m-213.504 329.728c-50.688 0-91.648-40.96-91.648-91.648s40.96-91.648 91.648-91.648c50.688 0 91.648 40.96 91.648 91.648-0.512 50.688-41.472 91.648-91.648 91.648z`,
    waterFlow: `M543.5 677.923a35.753 35.753 0 0 0 13.278-2.603 219.813 219.813 0 0 0 137.458-201.676 34.712 34.712 0 0 0-34.711-34.712 34.712 34.712 0 0 0-34.712 34.712 150.389 150.389 0 0 1-94.59 137.459 34.712 34.712 0 0 0 13.277 66.82z m-388.078 84.61a176.423 176.423 0 0 0 89.557-23.951 352.499 352.499 0 0 1-48.944-81.226 78.102 78.102 0 0 1-40.613 10.848 78.102 78.102 0 0 1-52.935-19.526L80.53 628.72a47.902 47.902 0 0 0-32.542-12.583 48.51 48.51 0 0 0-35.32 15.273 47.208 47.208 0 0 0 2.778 66.994l21.955 19.96a174.514 174.514 0 0 0 118.02 44.344z m855.907-126.35a48.336 48.336 0 0 0-66.386-4.08l-26.989 24.299a78.102 78.102 0 0 1-52.849 19.612 79.664 79.664 0 0 1-26.033-4.252 355.796 355.796 0 0 1-53.457 80.097 177.638 177.638 0 0 0 79.924 18.658 173.56 173.56 0 0 0 117.847-44.344l26.815-24.299a46.948 46.948 0 0 0 1.128-65.692zM915.524 888.19a48.51 48.51 0 0 0-28.203 8.678l-23.257 18.224a78.71 78.71 0 0 1-89.296 0l-15.013-11.716a175.642 175.642 0 0 0-208.27 0l-3.125 2.517a78.102 78.102 0 0 1-89.383 0 170.175 170.175 0 0 0-104.135-34.191 170.261 170.261 0 0 0-104.136 34.191l-4.252 3.471a74.197 74.197 0 0 1-44.692 13.885 74.11 74.11 0 0 1-44.604-13.885l-19.092-15.013a46.861 46.861 0 0 0-29.592-10.153 47.99 47.99 0 0 0-37.835 18.31 46.861 46.861 0 0 0-9.893 34.712 47.468 47.468 0 0 0 17.963 31.675l19.092 14.926a169.22 169.22 0 0 0 104.135 34.191 169.22 169.22 0 0 0 104.136-34.19l4.338-3.299a78.102 78.102 0 0 1 88.776 0.087 176.076 176.076 0 0 0 208.27 0l3.212-2.69a78.102 78.102 0 0 1 89.296 0l15.1 11.629a175.381 175.381 0 0 0 208.27 0l23.344-18.05a47.035 47.035 0 0 0 6.422-65.52 48.076 48.076 0 0 0-37.576-17.789z`,
    waterPress: `
M925.29365117 338.71957666c-22.61904785-53.43915322-54.89417989-101.32275146-96.03174638-142.59259249-41.26984102-41.26984102-89.28571463-73.41269854-142.59259249-96.03174638-55.42328057-23.41269844-114.02116435-35.31746075-174.60317461-35.31745987s-119.31216943 11.90476231-174.60317461 35.31745987c-53.30687871 22.61904785-101.32275146 54.89417989-142.46031797 96.03174638-41.26984102 41.26984102-73.54497393 89.28571463-96.16402089 142.59259249C75.29365039 394.14285722 63.38888896 452.74074102 63.38888896 513.32275127s11.90476231 119.31216943 35.31745987 174.60317461c22.61904785 53.43915322 54.89417989 101.32275146 96.16402177 142.59259248 41.26984102 41.26984102 89.15343926 73.54497393 142.59259248 96.03174638 55.29100518 23.41269844 114.02116435 35.31746075 174.60317461 35.31745987s119.31216943-11.90476231 174.60317462-35.31745987c53.43915322-22.61904785 101.32275146-54.89417989 142.59259248-96.03174638 41.26984102-41.26984102 73.54497393-89.15343926 96.03174638-142.59259248 23.41269844-55.42328057 35.31746075-114.02116435 35.31745987-174.60317461s-11.90476231-119.17989404-35.31745987-174.60317461zM787.19841231 788.58730127c-73.54497393 73.41269854-171.29629599 114.02116435-275.13227461 114.02116435-103.96825401 0-201.71957695-40.47619042-275.13227549-114.02116435C163.38888916 715.04232823 122.91269873 617.29100528 122.91269873 513.45502666c0-103.96825401 40.47619042-201.58730156 114.02116348-275.13227549 73.54497393-73.54497393 171.29629599-114.02116435 275.13227549-114.02116348 103.96825401 0 201.58730156 40.47619042 275.13227461 114.02116348 73.41269854 73.54497393 114.02116435 171.29629599 114.02116435 275.13227549-0.2645499 103.83597862-40.60846582 201.58730156-114.02116436 275.13227461z
M712.59523789 403.79894141c10.58201015-7.27513242 16.00529063-19.84126992 14.28571406-32.67195734-1.71957655-12.69841289-10.58201015-23.28042305-22.75132236-27.51322763-12.16931221-4.23280459-25.66137568-1.05820135-34.78836006 7.9365085l-130.95238096 108.33333311c-28.9682543-10.71428555-61.37566172-0.52910068-78.96825351 24.47089892-17.72486807 25.132275-16.4021168 59.12698448 3.43915312 82.6719583 19.70899453 23.67724834 52.91005254 30.95238076 80.82010635 18.1216925 27.91005292-12.96296279 43.65079365-43.12169297 38.22751318-73.41269767l130.68783018-107.93650869zM960.34656114 524.96296279c0.13227539-3.83597842 0.13227539-7.67195771 0.13227451-11.64021152 0-60.58201026-11.90476231-119.31216943-35.31745987-174.60317461-22.61904785-53.43915322-54.89417989-101.32275146-96.03174638-142.59259248-41.13756651-41.26984102-89.15343926-73.41269854-142.59259249-96.03174639-55.42328057-23.41269844-114.02116435-35.31746075-174.60317461-35.31745986s-119.31216943 11.90476231-174.60317461 35.31745986c-53.30687871 22.61904785-101.32275146 54.89417989-142.46031709 96.03174639-41.26984102 41.26984102-73.54497393 89.28571463-96.16402177 142.59259248C75.29365039 394.14285722 63.38888896 452.74074102 63.38888896 513.32275127c0 3.83597842 0 7.67195771 0.13227539 11.64021152-0.13227539 1.19047588-0.13227539 2.38095263-0.13227539 3.43915401 0 2.24867724 0.2645499 4.4973545 0.52910068 6.61375635 2.51322715 52.91005254 14.15343955 104.3650793 34.78835919 153.04232812 22.61904785 53.43915322 54.89417989 101.32275146 96.16402177 142.59259248 41.26984102 41.26984102 89.15343926 73.54497393 142.59259248 96.03174551 55.29100518 23.41269844 114.02116435 35.31746075 174.60317461 35.31746074s119.31216943-11.90476231 174.60317462-35.31746074c53.43915322-22.61904785 101.32275146-54.89417989 142.59259248-96.03174551 41.26984102-41.26984102 73.54497393-89.15343926 96.03174638-142.59259248 20.6349205-48.67724883 32.27513203-100.13227471 34.78835919-153.04232812 0.2645499-2.24867724 0.52910068-4.36507911 0.52910068-6.61375635 0-1.19047588-0.13227539-2.24867724-0.2645499-3.43915401zM808.62698428 765.30687823c-5.95238115-5.02645518-13.62433886-8.068783-22.08994717-8.06878302H430.32010625c-18.91534394 0-34.12698398 15.21164004-34.12698487 34.12698399s15.21164004 34.12698398 34.12698487 34.12698398H744.60582002c-66.79894219 50.0000001-147.61904766 76.98412705-232.40740694 76.98412705-84.92063467 0-165.74074102-26.98412695-232.40740781-76.98412705h15.87301611c18.91534394 0 34.12698398-15.21164004 34.12698399-34.12698398s-15.21164004-34.12698398-34.12698399-34.12698399H208.89153477c-12.43386211-15.34391542-23.54497383-31.48148145-33.3333334-48.41269804h336.11111102c18.78306857 0 33.99470859-15.21164004 33.9947086-33.99470948s-15.21164004-33.99470859-33.99470858-33.99470859H144.20899443c-7.8042331-22.48677246-13.49206348-45.76719551-17.06349199-69.70899462H169.20899492c23.67724834 0 42.72486768-19.17989385 42.72486768-42.72486768S192.75396787 485.54497373 169.20899492 485.54497373H123.83862471c4.89417979-68.51851875 27.24867685-133.4656081 65.34391464-189.55026475l33.20105889 33.20105802c16.6666667 16.6666667 43.78306905 16.6666667 60.44973486 0 16.6666667-16.6666667 16.6666667-43.78306905 0-60.44973487L244.60581991 230.51851895C306.77513222 171.78835977 384.94973516 135.67724844 469.20899463 126.55026494v52.51322725c0 23.67724834 19.17989385 42.72486768 42.72486767 42.72486768 23.67724834 0 42.72486768-19.17989385 42.72486768-42.72486768V126.68253945C640.50529062 136.07407373 720.26719561 173.37566094 782.96560859 234.35449737l-34.65608466 34.65608466c-16.6666667 16.6666667-16.6666667 43.78306905 0 60.44973574 16.6666667 16.6666667 43.78306905 16.6666667 60.44973574 0l28.96825342-28.9682543c36.11111133 55.15872979 57.67195781 118.51851885 62.30158769 185.18518478h-45.2380957c-23.67724834 0-42.72486768 19.17989385-42.72486768 42.72486855 0 23.67724834 19.17989385 42.72486768 42.72486768 42.72486767H896.72222217c-3.57142852 23.80952373-9.25925888 47.08994678-17.06349199 69.70899463H659.94973526c-18.78306857 0-33.99470859 15.21164004-33.9947086 33.99470859S641.1666667 708.82539717 659.94973526 708.82539717h188.75661415c-11.50793613 19.70899453-24.99999961 38.62433847-40.07936513 56.48148105z`,
    power: `M874.039 149.961c199.948 199.949 199.948 524.13 0 724.078-199.949 199.948-524.13 199.948-724.078 0-199.948-199.949-199.948-524.13 0-724.078 19.995-19.995 52.413-19.995 72.408 0 19.995 19.995 19.995 52.413 0 72.408-159.959 159.959-159.959 419.303 0 579.262 159.959 159.959 419.303 159.959 579.262 0 159.959-159.959 159.959-419.303 0-579.262-19.995-19.995-19.995-52.413 0-72.408 19.995-19.995 52.413-19.995 72.408 0zM562.2 0a1 1 0 0 1 1 1v510a1 1 0 0 1-1 1H461.8a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h100.4z`,
    snow: `M775.4 635.2l121.5 70.2-25 43.3-121.5-70.2 30.4 113.3-48.3 12.9-43.3-161.6L537 555.3V731l118.3 118.3-35.3 35.3-83-83V942h-50V801.7l-83 83-35.4-35.4L487 731V555.3l-151.6 87.5-43.3 161.6-48.3-12.9 30.4-113.3-122.1 70.5-25-43.3 122.1-70.5-113.3-30.4 12.9-48.3 161.6 43.3L462 512l-151.6-87.5-161.6 43.3-12.9-48.3 113.3-30.4-122.1-70.5 25-43.3 122.1 70.5-30.4-113.3 48.3-12.9 43.3 161.6L487 468.7v-175L368.7 175.4 404 140l83 83V82h50v141l83-83 35.4 35.4L537 293.7v175l152.1-87.8 43.3-161.6 48.3 12.9-30.4 113.3 121.5-70.2 25 43.3-121.5 70.2 113.3 30.4-12.9 48.3-161.6-43.3L562 512l152.1 87.8 161.6-43.3 12.9 48.3-113.2 30.4z`,
    sun: `M752.41931153 240.7063601c8.36993432 0 15.62255883 3.08990502 21.72821045 9.16589356 6.1353147 6.08093262 9.18566918 13.3928833 9.18566918 21.73315382 0 8.55285621-3.05035376 15.85986352-9.18566918 21.94079614l-43.67394996 43.66900658c-5.93261719 5.97216773-13.17041016 8.95825195-21.72326709 8.95825195-8.87420678 0-16.20098901-2.98608422-22.08911085-8.75061035-5.88317847-5.87329102-8.80004906-13.2890625-8.80004906-22.14843774 0-8.54791283 2.95642114-15.75604272 8.91375732-21.72821044l43.66900659-43.67394996c6.14025879-6.07598853 13.44726539-9.16589356 21.98034668-9.16589356z m37.66223167 240.39459181h61.79809547c8.52813721 0 15.82031227 2.98608422 21.83697534 9.06207276C879.78271508 496.24395728 882.78857422 503.45208717 882.78857422 512c0 8.55285621-3.00585914 15.85986352-9.07196021 21.83697533-6.01666236 6.07598853-13.30883813 9.06207276-21.83697534 9.06207276h-61.79809547c-8.52813721 0-15.80053734-2.98608422-21.86663841-9.06207276-6.01666236-5.97711182-9.05712867-13.2890625-9.05712867-21.83697533 0-8.55285621 3.04046631-15.76098609 9.05712867-21.83697533 6.06610107-6.07598853 13.33850122-9.06207276 21.86663841-9.06207276zM512 141.21142578c8.52813721 0 15.79064917 3.08990502 21.85180688 9.06207276 6.02160645 6.08093262 9.05712867 13.3928833 9.05712867 21.83697533v61.79809546c0 8.55285621-3.03552222 15.85986352-9.0521853 21.83697534-6.06610107 6.07598853-13.32861305 9.16589356-21.85675025 9.16589355-8.53802467 0-15.80053734-3.08990502-21.86663842-9.16589355-6.01666236-5.97711182-9.0521853-13.2890625-9.05218458-21.83697534V172.11047387c0-8.44409203 3.03552222-15.76098609 9.05218458-21.83697533C496.20440674 144.3013308 503.46691871 141.21142578 512.00494408 141.21142578zM271.81304907 240.7063601c8.36499023 0 15.61267066 3.08990502 21.743042 9.16589356l43.66900659 43.67394996c6.14025879 6.07598853 9.17083764 13.38793922 9.17083764 21.72821044 0 8.55285621-3.01080323 15.86480689-9.05712938 21.83697534-6.03149391 6.08093262-13.30389404 9.06207276-21.85180617 9.06207275-8.69622827 0-16.02795386-2.98608422-21.95068359-8.85443115l-43.68383814-43.67395068c-5.97216773-5.97216773-8.92858886-13.28411842-8.92858886-22.03967284 0-8.55285621 3.00585914-15.76098609 9.07196021-21.83697462 6.01666236-5.97216773 13.30883813-9.06207276 21.85675096-9.06207276h-0.03955126z m436.93725586 436.91253615c8.36499023 0 15.60772729 2.98608422 21.72326709 9.16589355l43.67394995 43.67395067c6.1353147 6.17980933 9.18566918 13.38793922 9.18566919 21.93585205 0 8.34521461-3.05035376 15.65716529-9.18566919 21.73315382-6.1105957 6.17980933-13.35827613 9.16589356-21.72326636 9.16589356-8.52813721 0-15.84008789-2.98608422-21.98034668-9.16589356l-43.66900659-43.66900587c-5.95733618-5.87329102-8.91375732-13.1852417-8.91375732-21.73315453 0-8.55285621 3.01080323-15.86480689 9.05712866-21.94079614 6.03149391-6.07598853 13.32861305-9.16589356 21.85180689-9.16589355h-0.01977564zM512.00494408 388.40380836c-34.12243628 0-63.22192359 12.05310035-87.39239525 36.2532351-24.1358645 24.10125732-36.21368384 53.25018335-36.21368384 87.34295654 0 34.0927732 12.07782007 63.24169922 36.21368384 87.44677734C448.78796387 623.53814721 477.88250709 635.59619164 512 635.59619164c34.12243628 0 63.23181176-12.05310035 87.4072268-36.15435838C623.51837158 575.2466433 635.59619164 546.09771729 635.59619164 512c0-34.0927732-12.07782007-63.24169922-36.18896484-87.34295654C575.23181176 400.45690942 546.12243628 388.40380836 512 388.40380836zM172.12036133 481.10095191h61.79809547c8.53802467 0 15.80053734 2.98608422 21.86663841 9.06207276 6.01666236 6.08093262 9.05712867 13.2890625 9.05712867 21.83697533 0 8.55285621-3.04046631 15.85986352-9.05712867 21.83697533-6.06610107 6.07598853-13.32861305 9.06207276-21.86663841 9.06207276h-61.79809547c-8.52813721 0-15.81042481-2.98608422-21.83697534-9.06207276C144.21728492 527.85986352 141.21142578 520.54791283 141.21142578 512c0-8.55285621 3.00585914-15.76098609 9.07196021-21.83697533 6.03149391-6.07598853 13.30883813-9.06207276 21.83697534-9.06207276zM512.00494408 759.19238258c8.52813721 0 15.79064917 2.98608422 21.85180617 9.06207274 6.02160645 6.08093262 9.05712867 13.2890625 9.05712938 21.83697535v61.79809546c0 8.55285621-3.03552222 15.85986352-9.0521853 21.83697533C527.79559326 879.80249 520.53308129 882.78857422 512 882.78857422c-8.53802467 0-15.80053734-2.98608422-21.86663842-9.06207276-6.01666236-5.97711182-9.0521853-13.2890625-9.05218458-21.83697533v-61.79809546c0-8.55285621 3.03552222-15.76098609 9.05218458-21.83697534 6.06610107-6.07598853 13.32861305-9.06207276 21.86663842-9.06207275z m-196.47839379-81.57348633c8.5034182 0 15.80053734 2.98608422 21.84686279 9.16589355 6.03149391 6.08093262 9.07196021 13.3928833 9.07196021 21.94079614 0 8.44409203-3.08001685 15.65222192-9.19555664 21.72821044l-43.67394995 43.67394996c-6.10565162 6.17980933-13.34838867 9.16589356-21.72326637 9.16589356-8.54791283 0-15.84008789-2.98608422-21.85180687-8.96319533-6.07104516-6.07598853-9.0769043-13.38793922-9.0769043-21.93585205 0-8.65173364 2.95642114-15.96862769 8.92858887-21.94079614l43.68383813-43.66900658c6.10565162-6.17980933 13.44232202-9.16589356 21.95068359-9.16589355h0.03955054zM512 326.60571289c33.628052 0 64.6506958 8.34521461 93.0481565 24.81811547 28.42712378 16.69042992 50.92163109 39.1404419 67.4637456 67.56756568 16.57177758 28.32824708 24.86755347 59.32617188 24.86755347 93.00860596 0 33.68243408-8.27600098 64.68035888-24.86755347 93.10748267-16.58166504 28.32824708-39.08605981 50.77825904-67.4637456 67.4637456-28.36285424 16.58166504-59.37561059 24.82305884-93.0481565 24.82305884-33.66760254 0-64.67047143-8.24139381-93.05804468-24.81811547-28.37768578-16.69042992-50.86230492-39.14538598-67.46374487-67.46868897-16.58166504-28.42712378-24.86755347-59.42504859-24.86755348-93.10748267 0-33.68243408 8.31555152-64.68035888 24.86755348-93.00860596 16.55200195-28.42712378 39.03662109-50.87713647 67.46374487-67.56262231C447.35424828 334.94598413 478.371948 326.60571289 512 326.60571289z`,
    clock: `M805.352 850.607C726.756 918.757 624.194 960 512 960c-111.986 0-214.375-41.089-292.914-109.013L118.882 951.19c-12.497 12.497-32.758 12.497-45.255 0-12.496-12.497-12.496-32.758 0-45.255L173.773 805.79C105.396 727.138 64 624.403 64 512c0-71.999 16.984-140.031 47.165-200.308C82.212 285.695 64 247.974 64 206c0-78.424 63.576-142 142-142 41.974 0 79.695 18.212 105.692 47.165C371.969 80.985 440 64 512 64s140.031 16.984 200.308 47.165C738.305 82.212 776.025 64 818 64c78.424 0 142 63.576 142 142 0 41.975-18.212 79.695-47.165 105.692C943.015 371.969 960 440 960 512c0 112.194-41.242 214.756-109.393 293.352l99.898 99.898c12.496 12.497 12.496 32.758 0 45.255-12.497 12.496-32.758 12.496-45.255 0l-99.898-99.898zM255.154 144.892C241.778 134.314 224.877 128 206.5 128c-43.354 0-78.5 35.146-78.5 78.5 0 18.376 6.314 35.278 16.892 48.654a450.533 450.533 0 0 1 110.262-110.262z m514.224 0.373a450.53 450.53 0 0 1 110.197 110.556C890.473 242.342 897 225.183 897 206.5c0-43.354-35.146-78.5-78.5-78.5-18.592 0-35.674 6.463-49.122 17.265zM512 896c212.077 0 384-171.923 384-384S724.077 128 512 128 128 299.923 128 512s171.923 384 384 384z m32-397.174L720.97 601c15.306 8.837 20.55 28.407 11.713 43.713-8.836 15.305-28.407 20.55-43.713 11.713l-192.257-111a32.01 32.01 0 0 1-7.17-5.63C483.651 533.992 480 525.923 480 517V295c0-17.673 14.327-32 32-32 17.673 0 32 14.327 32 32v203.826z`,
    history: `M936.5 704.2H85.9c-11 0-19.9 11.2-19.9 25s8.9 25 19.9 25h850.6c11 0 19.9-11.2 19.9-25-0.1-13.8-9-25-19.9-25zM107.3 532.5l250.2-181L562.6 548l344.3-338.4c0.5-0.5 1-1.1 1.5-1.7l0.6 69.2c0.1 13.7 11.3 24.8 25 24.8h0.2c13.8-0.1 24.9-11.4 24.8-25.2l-1.2-153-163.9 0.3c-13.8 0-25 11.2-25 25s11.2 25 25 25l78-0.1-0.1 0.1-309.7 304.4L362 286.6 78 492c-11.2 8.1-13.7 23.7-5.6 34.9s23.7 13.7 34.9 5.6z m800.9-358.6v1.4c-0.3-0.4-0.6-0.7-1-1l-0.4-0.4h1.4z`
}

interface IProps {
    path: string;
    fill?: string;
    stroke?: string;
}
export function SvgSrc(props: IProps): string {
    const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
        <path fill="${props.fill}" stroke="${props.stroke}" d="${props.path}"/>
    </svg>
`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`
}