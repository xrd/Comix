/** @jsx React.DOM */

var CxFrame = React.createClass({

  render: function() {

      var createFrame = function( text ) {
          return (
                  <div class="scrollblock"> { text } </div>
          );
      }
      
      return (
              <div class="col-md-3" style="border: 1px dotted grey; height: 400px;">
              { this.props.items.map(createFrame) }
              </div>
      );
  }
});


var CxComix = React.createClass({
    getInitialState: function() {
        return {items: [], text: ''};
    },
    
    render: function() {
        return (
                <div class='text-center'><h1> { this.props.title } </h1></div>
                <CxFrame items={this.state.items} />
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
