/** @jsx React.DOM */

var CxComix = React.createClass({
    render: function() {
        return (
                <div class='text-center'><h1> { this.props.title } </h1></div>
        );
    }
});

var CxControls = React.createClass({
    goUp: function() {
        
    },
    goDown: function() {

    },
    render: function() {
        return (
                <div>
                <div style='position: fixed; width: 100%; z-index: 1000;'>                                               
                <div class='controls' ng-show='controls' class='text-center' style='width: 100%'>
                <span onclick='goUp()' class='glyphicon glyphicon-arrow-up'></span>
                <span onclick='goDown()' class='glyphicon glyphicon-arrow-down'></span>
                <span class='glyphicon glyphicon-home'></span>
                </div>
                </div>
        );    
    }
});

var CxCharacter = React.createClass( {
    render: function() {
        return (
            <img src={'/assets/images/' + this.props.name + '.png'} />
        );
    }
});

var CxFrame = React.createClass({
  render: function() {
    return (
            <div class="col-md-3" style="border: 1px dotted grey; height: 400px;">
            <div class="scrollblock">Something</div>
            </div>
    );
  }
});

var CxDialog = React.createClass({
  render: function() {
    return (
      <a href={'http://www.facebook.com/' + this.props.username}>
        {this.props.username}
      </a>
    );
  }
});

React.renderComponent(

        <CxComix controls="true" title="The Unicorn in Me">

        <CxFrame>
        <CxDialog animation="zoomInDown" delay="2s" from="grandad">I think I was a unicorn once...</CxDialog>
        <CxCharacter name="grandad" animation="pulse" />
        <CxCharacter name="grandson" animation="wobble" />
        </CxFrame>
        
        <CxFrame>
        <CxCharacter name="fish" animation="wobble" top="40" left="100"/>
        </CxFrame>
        
        <CxFrame>
        <CxCharacter name="fish" width="60"/>
        </CxFrame>
        
        <CxFrame>
        <CxCharacter name="fish" animation="wobble"/>
        </CxFrame>
        
    </CxComix>,
    
  document.getElementById('example')
);
