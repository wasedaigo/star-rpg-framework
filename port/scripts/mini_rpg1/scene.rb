module MiniRPG1
  class Scene
    def initialize(model, view, controller)
      @model = model
      @view = view
      @controller = controller
    end

    def update(stack)
      @controller.update(@model, stack, self)
    end
    
    def render(s)
      @view.update(@model, s)
    end
  end
end
