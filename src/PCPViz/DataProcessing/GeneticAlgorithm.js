import {CorrelationMatrix} from './CorrelationTable.js';
import casesFactors from '../Data/CasesFactors.json';
var POP_SIZE = 20;
var corrMatrix;

function get_correlation_matrix()
{
    let [labels, corrMat] = CorrelationMatrix(casesFactors);
    corrMatrix = corrMat;
   // console.log(corrMat);
}

function lessthan(t1, t2)
{
    return t1.fitness < t2.fitness;
}

function cal_fitness(gnome){
    var f = 0;
    var i = 0;
    //console.log(corrMatrix);
    //console.log(gnome);
    /*for(i=0; i<gnome.length -1; i++){
         f += (1- Math.abs(corrMatrix[gnome[i]][gnome[i+1]]));
    }*/
    return f;
}

function repeat(s, ch)
{
    var i=0;
    for(i=0; i<s.length; i++){
        if(s[i] == ch)
            return true;
    }
    return false;
}


function create_gnome(len)
{
    var gnome = [];
    while(true){
        if(gnome.length == len){
            break;
        }
        var temp = Math.floor *( (Math.random() * len) + 1);
        if(!repeat(gnome, temp)){
            gnome.push(temp);
        }
    }

    return gnome;
}

function mutated_gene(gnome)
{
    var V = gnome.length;
    while(true){
        var r = Math.floor( Math.random()* V + 1); // random number from 1 to V
        var r1 = Math.floor( Math.random() * V + 1); // random number from 1 to V
        if(r1 != r){
            var temp = gnome[r];
            gnome[r] = gnome[r1];
            gnome[r1] = temp;
            break;
        }
    }
    return gnome;
}

function cooldown(temperature){
    return (90*temperature)/100;
}

const GeneticAlgorithm = (len) => {
    get_correlation_matrix();

    // generation number
    var gen = 1;
    // number of gene iterations
    var gen_thres = 20;

    let population = [];

    var i = 0;
    // populating the GNOME pool
    for(i=0; i<POP_SIZE; i++){
        let temp_gnome = create_gnome(len);
        let temp = {"gnome":temp_gnome, "fitness": cal_fitness(temp_gnome)};
        population.push(temp);
    }

    let found = false;
    var temperature = 100000;

    while(temperature > 1000 && gen <= gen_thres){
        //console.log(population);
        population.sort((a,b) => {
            let fa = a.fitness;
            let fb = b.fitness;
            if(fa<fb){
                return -1;
            }
            if(fa>fb){
                return 1;
            }
            return 0;
        });
        let new_population = [];

        var j=0;
        for(j=0; j<POP_SIZE; j++){
            var p1 = population[j];
            while(true){
                let new_g = mutated_gene(p1.gnome);
                var new_gnome_gnome = new_g;
                var new_gnome_fitness = cal_fitness(new_gnome_gnome);
                var new_gnome = {"gnome":new_gnome_gnome, "fitness":new_gnome_fitness};

                if(new_gnome.fitness > population[j].fitness){
                    new_population.push(new_gnome);
                    break;
                }
                else{
                    var prob = Math.pow(2.7, -1 * (new_gnome.fitness - population[j].fitness)/temperature);
                    if(prob > 0.5){
                        new_population.push(new_gnome);
                        break;
                    }
                }
            }
        }
        temperature = cooldown(temperature);
        population = new_population;
        gen++;
    }
}

export default GeneticAlgorithm;