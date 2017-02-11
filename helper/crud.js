var helper = function(model){
  this.model = model;

  this.list = (filter)=>{
    return new Promise((fullfill,reject)=>{
      this.model
        .find(filter)
        .select('-__v')
        .then(fullfill)
        .catch(reject);
    });
  }

  this.getOne = (id)=>{
    return new Promise((fullfill,reject)=>{
      this.model
        .findOne({_id:id})
        .select('-__v')
        .then(fullfill)
        .catch(reject);
    });
  }

  this.add = (data)=>{
    return new Promise((fullfill,reject)=>{
      new this.model(data)
        .save()
        .then(fullfill)
        .catch(reject);
    });
  }

  this.update = (data)=>{
    return new Promise((fullfill,reject)=>{
      model
        .findOneAndUpdate({_id:data._id},{$set:data},{new:true})
        .then(fullfill)
        .catch(reject);
    });
  }

  this.del = (id)=>{
    return new Promise((fullfill,reject)=>{
      model
        .findOne({_id:id})
        .remove()
        .then(fullfill)
        .catch(reject);
    });
  }
}

module.exports = helper;
