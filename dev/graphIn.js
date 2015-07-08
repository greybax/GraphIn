class GraphIn {
  constructor() {
    this.levels = [];
    this.maxIsReached = false;
  }

  render(array) {
    if (this.maxIsReached) {
      return;
    }

    var allFriends = this.getAllElementsOfArray(array);
    var self = this;

    this.getElementData(allFriends).then((data) => {
      var friendsData = data;
      array.forEach(function(friendLine, index, array) {
        self.addLink(friendLine, friendsData);
      });
    })
  }

  addLink(array, friendsData) {
    var colWidth = Math.round($("#SvgjsSvg1000").attr('width') / array.length);
    var hPos = Math.round($("#SvgjsSvg1000").attr('width') / array.length / 2);
    var vPos = Math.round($("#SvgjsSvg1000").attr('height') / 2);
    var radius = 30;
    var maxFriendInLevel = 9;

    var self = this;
    this.levels.forEach(function(level, index, ar) {
      if (level['count'] >= maxFriendInLevel) {
        self.maxIsReached = true;
      }
    });

    if (this.maxIsReached) {
      return;
    }

    //we get line with length more then already found
    if (array.length > this.levels.length && this.levels[0]) {
      return;
    }

    for (var i = 0; i < array.length - 1; i++) {
      if (!this.levels[i]) {
        this.levels[i] = [];
        this.levels[i]['count'] = 0;
      }
      if (!this.levels[i + 1]) {
        this.levels[i + 1] = [];
        this.levels[i + 1]['count'] = 0;
      }

      var vPosFirst = this.getvPos(i, array, vPos);
      var vPosSecond = this.getvPos(i + 1, array, vPos);

      this.drawLine(hPos + radius + 3, vPosFirst, hPos + colWidth - radius - 3, vPosSecond);

      // if not exists friend then create new
      if (!this.levels[i][array[i]]) {
        var data = this.findElementData(array[i], friendsData);
        var title = this.getTitle(data);
        this.levels[i][array[i]] = this.drawCircle(data, hPos, vPosFirst, 25, radius);
        this.drawText(title, hPos, vPosFirst, radius);
        this.levels[i]['count'] = this.levels[i]['count'] + 1;
      }

      // if not exists friend then create new
      if (!this.levels[i + 1][array[i + 1]]) {
        var data = this.findElementData(array[i + 1], friendsData);
        var title = this.getTitle(data);
        this.levels[i + 1][array[i + 1]] = this.drawCircle(data, hPos + colWidth, vPosSecond, 25, radius);
        this.drawText(title, hPos + colWidth, vPosSecond, radius);
        this.levels[i + 1]['count'] = this.levels[i + 1]['count'] + 1;
      }

      hPos += colWidth;
    }
  }
  
  getTitle(data) {
    return data;
  }
  
  getBackgroundUrl(data) {
    return "";
  }

  getElementData(allFriends) {
    return new Promise((resolve, reject) => {
      resolve(allFriends);
    })
  }

  findElementData(id, friendsData) {
    return id;
  }

  getAllElementsOfArray(list) {
    var results = [];
    list.forEach(function(secondList, index, array) {
      secondList.forEach(function(elem, index, array) {
        if (results.indexOf(elem) < 0) {
          results.push(elem);
        }
      });
    });

    return results;
  }

  getvPos(i, array, vPos) {
    var result;
    if (this.levels[i][array[i]]) {
      var firstFriendCircle = this.levels[i][array[i]];
      result = firstFriendCircle[0][0].attributes['cy'].value;
    } else {
      var count = this.levels[i]['count'];
      var height;
      if (count % 2 == 0) {
        height = count / 2;
      } else {
        height = (count + 1) / 2;
      }
      result = vPos + Math.pow(-1, count) * height * 100;
    }
    return result;
  }
  
  drawLine(x1, y1, x2, y2) {
    d3.select("svg").append("line")
      .attr({
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2,
        "stroke": "#d9e0e7",
        "stroke-width": "2",
      });
  }

  drawCircle(userInfo, hPos, vPos, shift, radius) {
    var id = "id5_" + hPos + "_" + vPos;
    d3.select("svg").append("svg:image")
      .attr({
        "xlink:href": this.getBackgroundUrl(userInfo),
        "width": 50,
        "height": 50,
        "cursor": "pointer",
        "style": "cursor:pointer;",
        "fill": "#f7f7ff",
        "x": hPos - shift,
        "y": vPos - shift
      })
      .on("click", function() {
        d3.selectAll(".stroke5").attr("stroke", "#d9e0e7");
        d3.select("#" + id).attr("stroke", "#799dc1");

        this.drawForeignObject(userInfo, hPos, vPos, radius);
      });

    var mainCircle = d3.select("svg").append("ellipse")
      .attr({
        "class": "stroke11_5",
        "cx": hPos,
        "cy": vPos,
        "rx": radius,
        "ry": radius,
        "stroke-width": "11.5",
        "fill": "none",
        "stroke": "#f7f7ff",
        "style": "cursor:pointer;"
      })
      .on("click", function() {
        d3.selectAll(".stroke5").attr("stroke", "#d9e0e7");
        d3.select("#" + id).attr("stroke", "#799dc1");

        this.drawForeignObject(userInfo, hPos, vPos, radius);
      });

    d3.select("svg").append("ellipse")
      .attr({
        "id": id,
        "class": "stroke5",
        "cx": hPos,
        "cy": vPos,
        "rx": radius,
        "ry": radius,
        "stroke-width": "5",
        "stroke": "#d9e0e7",
        "fill": "none",
        "style": "cursor:pointer;"
      })
      .on("click", function() {
        d3.selectAll(".stroke5").attr("stroke", "#d9e0e7");
        d3.select(this).attr("stroke", "#799dc1");

        this.drawForeignObject(userInfo, hPos, vPos, radius);
      });

    return mainCircle;
  }

  drawText(text, hPos, vPos, radius) {
    d3.select("svg").append("text")
      .attr({
        "cursor": "pointer",
        "style": "font-size:11;font-family:Helvetica,Arial,sans-serif;text-anchor:middle;cursor:pointer;font-weight:bold;",
        "fill": "#5f83aa",
        "font-weight": "bold",
        "text-anchor": "middle",
        "font-size": "11",
        "x": hPos,
        "y": vPos + radius + 15
      })
      .text(text);
  }

  drawForeignObject(userInfo, hPos, vPos, radius) {  }
}